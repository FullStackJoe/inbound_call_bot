from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://happyrobot:happyrobot@db:5432/happyrobot"
    api_key: str = "change-me-in-production"
    environment: str = "development"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
