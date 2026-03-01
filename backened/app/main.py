from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.storyteller import router

app = FastAPI(title="Creative Storyteller")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Updated to be more permissive for deployment, or you can specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "creative-storyteller-backend"}

app.include_router(router, prefix="/api")