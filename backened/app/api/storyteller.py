import json
import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.gemini_client import generate_story
from app.services.image_generator import generate_image_base64
from app.services.audio_generator import generate_audio_base64

router = APIRouter()

@router.get("/story")
async def create_story_stream(topic: str, style: str = "3D digital art"):
    async def event_generator():
        # 1. Read prompt template
        with open('app/prompts/creative_director.txt') as f:
            template = f.read()
        
        # Inject style into the prompt
        prompt = f"{template}\n\nTopic: {topic}\n\nRequested Art Style: {style}"

        # 2. Generate JSON story (text blocks + image prompts + audio content)
        raw_output = await generate_story(prompt)
        data = json.loads(raw_output)
        
        blocks = data.get("blocks", [])
        
        # 3. Start async tasks immediately (images and audio)
        async_tasks = []
        for i, block in enumerate(blocks):
            if block["type"] == "image":
                task = asyncio.create_task(generate_image_base64(block["prompt"]))
                async_tasks.append((i, task))
            elif block["type"] == "audio":
                task = asyncio.create_task(generate_audio_base64(block["content"]))
                async_tasks.append((i, task))
            else:
                # 4. Stream non-async blocks (text/summary/metadata) immediately
                yield json.dumps({"index": i, "block": block}) + "\n"

        # 5. As each task finishes, stream it to the frontend
        if async_tasks:
            async def wrap_task(idx, task):
                return idx, await task

            wrapped_tasks = [wrap_task(idx, task) for idx, task in async_tasks]
            for completed in asyncio.as_completed(wrapped_tasks):
                original_idx, result = await completed
                
                # Update the original block with the base64 data
                updated_block = blocks[original_idx].copy()
                if updated_block["type"] == "image":
                    updated_block["image_base64"] = result
                elif updated_block["type"] == "audio":
                    updated_block["audio_base64"] = result
                
                yield json.dumps({"index": original_idx, "block": updated_block}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")
