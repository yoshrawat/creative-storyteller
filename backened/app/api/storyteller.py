import logging

from fastapi import APIRouter
from app.services.gemini_client import generate_story
from app.schemas.blocks import StoryResponse
import json
from app.services.image_generator import generate_image_base64


router = APIRouter()


@router.get("/story", response_model=StoryResponse)
def create_story(topic: str):
    prompt = f"""
    {open('app/prompts/creative_director.txt').read()}

    Topic: {topic}
    """

    raw_output = generate_story(prompt)
    data = json.loads(raw_output)
    logging.info(f"Generated story data: {data}")
    print(f"Generated story data: {data}")
    for block in data["blocks"]:
        if block["type"] == "image":
            logging.info(f"Generating image for block with prompt: {block['prompt']}")
            base64_img = generate_image_base64(block["prompt"])
            block["image_base64"] = base64_img

    return data