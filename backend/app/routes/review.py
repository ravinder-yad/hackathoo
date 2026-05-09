from fastapi import APIRouter, Depends
from app.schemas.review_schema import ReviewSchema
from app.services.review_service import submit_review, get_worker_reviews
from typing import List

router = APIRouter()

@router.post("/")
async def create_review(data: ReviewSchema):
    return await submit_review(data)

@router.get("/{worker_email}")
async def get_reviews(worker_email: str):
    return await get_worker_reviews(worker_email)
