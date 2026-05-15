import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "HireAgain"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "HireAgain_db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
