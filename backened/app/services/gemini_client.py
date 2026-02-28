import vertexai
from vertexai.generative_models import GenerativeModel
from app.config import settings

vertexai.init(
    project=settings.GCP_PROJECT,
    location=settings.GCP_REGION
)

model = GenerativeModel(settings.GEMINI_MODEL)


def generate_story(prompt: str):
    response = model.generate_content(
        prompt,
        generation_config={
            "temperature": 0.8,
            "response_mime_type": "application/json"
        }
    )
    return response.text