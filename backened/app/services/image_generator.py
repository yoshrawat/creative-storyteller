import asyncio
import base64
import time
from google import genai
from google.genai import types
from app.config import settings

# Initialize the new Gen AI Client for Vertex AI
client = genai.Client(
    vertexai=True,
    project=settings.GCP_PROJECT,
    location=settings.GCP_REGION
)

# Limit concurrent image generations to avoid hitting rate limits immediately
# Many trial accounts have very low concurrent request quotas.
image_semaphore = asyncio.Semaphore(2)

async def generate_image_base64(prompt: str, retries: int = 3) -> str:
    async with image_semaphore:
        for attempt in range(retries):
            try:
                # Use the asynchronous client (.aio) and JPEG for speed
                response = await client.aio.models.generate_images(
                    model="imagen-3.0-generate-001",
                    prompt=prompt,
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        aspect_ratio="1:1",
                        add_watermark=False,
                        output_mime_type="image/jpeg",
                        safety_filter_level="BLOCK_ONLY_HIGH",
                        person_generation="ALLOW_ALL",
                        include_rai_reason=True
                    )
                )

                if not response.generated_images:
                    print(f"No images generated for prompt: {prompt}")
                    print(f"Response details: {response}")
                    return ""

                # Get bytes from the generated image
                image = response.generated_images[0].image
                image_bytes = image.image_bytes
                
                if image_bytes is None:
                    print(f"Image object returned but image_bytes is None for prompt: {prompt}")
                    return ""

                print(f"Generated image for prompt: {prompt}, size: {len(image_bytes)} bytes")
                return base64.b64encode(image_bytes).decode("utf-8")

            except Exception as e:
                # Check for rate limit error
                if "429" in str(e) and attempt < retries - 1:
                    wait_time = 2 ** (attempt + 1) # Exponential backoff: 2, 4, 8 seconds
                    print(f"Rate limited (429) for prompt '{prompt[:30]}...'. Retrying in {wait_time}s (Attempt {attempt + 1}/{retries})")
                    await asyncio.sleep(wait_time)
                    continue
                
                print(f"Error generating image for prompt '{prompt[:30]}...': {e}")
                return ""
        
        return ""
