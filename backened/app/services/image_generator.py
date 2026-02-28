import vertexai
from vertexai.generative_models import GenerativeModel
import base64
from app.config import settings

vertexai.init(
    project=settings.GCP_PROJECT,
    location=settings.GCP_REGION
)

image_model = GenerativeModel("gemini-1.5-pro")  # supports image generation


def generate_image_base64(prompt: str) -> str:
    response = image_model.generate_content(
        prompt,
        generation_config={
            "response_mime_type": "image/png"
        }
    )

    image_bytes = response.candidates[0].content.parts[0].inline_data.data
    return base64.b64encode(image_bytes).decode("utf-8")