import json
import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.gemini_client import generate_story
from app.services.image_generator import generate_image_base64

router = APIRouter()

@router.get("/story")
async def create_story_stream(topic: str):
    async def event_generator():
        # 1. Read prompt template
        with open('app/prompts/creative_director.txt') as f:
            template = f.read()
        
        prompt = f"{template}\n\nTopic: {topic}"

        # 2. Generate JSON story (text blocks + image prompts)
        raw_output = await generate_story(prompt)
        data = json.loads(raw_output)
        
        blocks = data.get("blocks", [])
        
        # 3. Start image generation tasks immediately for all image blocks
        image_tasks = []
        for i, block in enumerate(blocks):
            if block["type"] == "image":
                task = asyncio.create_task(generate_image_base64(block["prompt"]))
                # Store task and block index for matching later
                image_tasks.append((i, task))
            else:
                # 4. Stream non-image blocks (text/summary) immediately
                yield json.dumps({"index": i, "block": block}) + "\n"

        # 5. As each image finishes, stream it to the frontend
        # We use as_completed to send them as soon as each one is ready
        if image_tasks:
            async def wrap_task(idx, task):
                return idx, await task

            wrapped_tasks = [wrap_task(idx, task) for idx, task in image_tasks]
            for completed in asyncio.as_completed(wrapped_tasks):
                original_idx, img_b64 = await completed
                
                # Update the original block with the base64 data
                updated_block = blocks[original_idx].copy()
                updated_block["image_base64"] = img_b64
                
                yield json.dumps({"index": original_idx, "block": updated_block}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")
