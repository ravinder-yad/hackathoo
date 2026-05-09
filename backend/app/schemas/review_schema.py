from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewSchema(BaseModel):
    worker_email: str
    user_email: str
    booking_id: str
    rating: float = Field(..., ge=1, le=5)
    review: Optional[str] = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ReviewResponse(BaseModel):
    id: str
    worker_email: str
    user_email: str
    user_name: str
    rating: float
    review: str
    created_at: datetime
