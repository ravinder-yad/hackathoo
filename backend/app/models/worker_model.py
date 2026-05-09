from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class Worker(BaseModel):
    name: str
    email: EmailStr
    password: str  # This will be hashed
    skills: List[str]
    experience: Optional[int] = 0
    photo: Optional[str] = None
    id_proof: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    verified: bool = False
    rating: float = 0.0
    total_jobs: int = 0
    role: str = "worker"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Amit",
                "email": "amit@example.com",
                "password": "hashed_password",
                "skills": ["Plumbing", "Electrical"],
                "verified": False,
                "role": "worker"
            }
        }
