from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    name: str
    email: EmailStr
    password: str  # This will be hashed
    role: str = "user"
    photo: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Ravi",
                "email": "ravi@gmail.com",
                "password": "hashed_password",
                "role": "user"
            }
        }
