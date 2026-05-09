from pydantic import BaseModel, EmailStr
from typing import Optional, List

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"  # "user" or "worker"
    # Worker specific fields (optional if role is user)
    skills: Optional[List[str]] = []
    experience: Optional[int] = 0
    phone: Optional[str] = None
    address: Optional[str] = None
    joined_at: Optional[str] = None

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None
    joined_at: Optional[str] = None
    experience: Optional[int] = 0
