from fastapi import APIRouter
from app.services.gemini_client import generate_story
from app.schemas.blocks import StoryResponse
import json

router = APIRouter()


@router.get("/story", response_model=StoryResponse)
def create_story(topic: str):
    prompt = f"""
    {open('app/prompts/creative_director.txt').read()}

    Topic: {topic}
    """

    raw_output = generate_story(prompt)
    return json.loads(raw_output)