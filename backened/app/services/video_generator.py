from google import genai
from google.genai import types
import base64
from app.config import settings
import asyncio

# Initialize the new Gen AI Client for Vertex AI
client = genai.Client(
    vertexai=True,
    project=settings.GCP_PROJECT,
    location=settings.GCP_REGION
)

# Simple wrapper to satisfy SDK's internal check for .name attribute
class OpWrapper:
    def __init__(self, name):
        self.name = name

# Limit concurrent video generations
video_semaphore = asyncio.Semaphore(1)

async def generate_video_base64(prompt: str, retries: int = 2) -> str:
    async with video_semaphore:
        for attempt in range(retries):
            try:
                # Initiate the video generation
                operation = await client.aio.models.generate_videos(
                    model="veo-3.1-fast-generate-001",
                    prompt=prompt,
                    config=types.GenerateVideosConfig(
                        number_of_videos=1,
                        fps=24,
                        duration_seconds=6,
                        person_generation="ALLOW_ALL"
                    )
                )

                # Identify how to poll
                if isinstance(operation, str):
                    poll_subject = OpWrapper(operation)
                else:
                    poll_subject = operation

                print(f"Video operation started. Polling for results...")

                # Poll for completion
                response = None
                max_polls = 120 # 10 minutes max
                for i in range(max_polls):
                    current_op = await client.aio.operations.get(poll_subject)
                    
                    if getattr(current_op, 'done', False):
                        # Check for errors first
                        if getattr(current_op, 'error', None):
                            print(f"Video operation failed with error: {current_op.error}")
                            break

                        # Look for response in multiple possible fields
                        response = getattr(current_op, 'response', None)
                        if not response:
                            response = getattr(current_op, 'result', None)
                        
                        # If it's a method (unlikely here but safe), try calling it
                        if callable(response):
                            try:
                                response = response()
                            except:
                                pass
                        break
                    
                    if i % 6 == 0: # Print every 30s
                        print(f"Still generating video... ({i*5}s elapsed)")
                    await asyncio.sleep(5)
                else:
                    print(f"Video generation timed out.")
                    return ""

                if not response or not hasattr(response, "generated_videos") or not response.generated_videos:
                    print(f"No videos in response object. Full op: {current_op}")
                    return ""

                # Get bytes from the generated video
                video_bytes = response.generated_videos[0].video.video_bytes

                if video_bytes is None:
                    print(f"Video bytes is None.")
                    return ""

                print(f"Generated video size: {len(video_bytes)} bytes")
                return base64.b64encode(video_bytes).decode("utf-8")

            except Exception as e:
                if "429" in str(e) and attempt < retries - 1:
                    wait_time = 30 * (attempt + 1)
                    print(f"Rate limited (429). Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                    continue

                print(f"Error generating video: {e}")
                return ""

        return ""
