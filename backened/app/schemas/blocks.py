from pydantic import BaseModel, Field
from typing import List, Literal, Optional


class TextBlock(BaseModel):
    type: Literal["text"]
    content: str = Field(..., min_length=5)


class ImageBlock(BaseModel):
    type: Literal["image"]
    prompt: str = Field(..., min_length=10)
    style: Optional[str] = "illustration"
    aspect_ratio: Optional[str] = "1:1"


class AudioBlock(BaseModel):
    type: Literal["audio"]
    narration: str = Field(..., min_length=5)
    voice: Optional[str] = "neutral"


class SummaryBlock(BaseModel):
    type: Literal["summary"]
    content: str


StoryBlock = TextBlock | ImageBlock | AudioBlock | SummaryBlock


class StoryResponse(BaseModel):
    blocks: List[StoryBlock]