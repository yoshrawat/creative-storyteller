from google import genai
from google.genai import types
import base64
from app.config import settings
import logging

# Initialize the new Gen AI Client for Vertex AI
client = genai.Client(
    vertexai=True,
    project=settings.GCP_PROJECT,
    location=settings.GCP_REGION
)

def generate_image_base64(prompt: str) -> str:
    # Use the 'fast' model to help with quota and latency
    response = client.models.generate_images(
        model="imagen-3.0-fast-generate-001",
        prompt=prompt,
        config=types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio="1:1",
            add_watermark=False,
        )
    )

    # Get bytes from the generated image
    image_bytes = response.generated_images[0].image.image_bytes
    # logging.info(f"Generated image for prompt: {prompt}, size: {len(image_bytes)} bytes")
    print(f"Generated image for prompt: {prompt}, size: {len(image_bytes)} bytes")
    return base64.b64encode(image_bytes).decode("utf-8")
