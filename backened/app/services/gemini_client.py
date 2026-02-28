from google import genai
from app.config import settings

# Initialize the new Gen AI Client for Vertex AI
client = genai.Client(
    vertexai=True,
    project=settings.GCP_PROJECT,
    location=settings.GCP_REGION
)

async def generate_story(prompt: str):
    # Use the asynchronous unified client
    response = await client.aio.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config={
            "temperature": 0.8,
            "response_mime_type": "application/json"
        }
    )
    return response.text
