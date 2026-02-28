from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GCP_PROJECT: str
    GCP_REGION: str = "us-central1"
    GEMINI_MODEL: str = "gemini-2.0-flash"

    class Config:
        env_file = ".env"

settings = Settings()