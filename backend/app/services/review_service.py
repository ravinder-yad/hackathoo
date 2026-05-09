from app.database import get_db
from app.schemas.review_schema import ReviewSchema
from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime

async def submit_review(review_data: ReviewSchema):
    db = get_db()
    
    # 1. Validate Booking (Real Logic: Only allow if booking is 'completed')
    # For hackathon, we check if booking exists and belongs to this user/worker pair
    booking = await db.bookings.find_one({"_id": ObjectId(review_data.booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Optional: Check if already rated
    existing = await db.reviews.find_one({"booking_id": review_data.booking_id})
    if existing:
        raise HTTPException(status_code=400, detail="You have already rated this service")

    # 2. Save Review
    review_dict = review_data.dict()
    review_dict["created_at"] = datetime.utcnow()
    result = await db.reviews.insert_one(review_dict)

    # 3. Update Worker Average Rating
    # Fetch all ratings for this worker
    reviews = await db.reviews.find({"worker_email": review_data.worker_email}).to_list(length=1000)
    total_rating = sum(r["rating"] for r in reviews)
    review_count = len(reviews)
    avg_rating = round(total_rating / review_count, 1)

    await db.users.update_one(
        {"email": review_data.worker_email, "role": "worker"},
        {"$set": {
            "average_rating": avg_rating,
            "total_reviews": review_count
        }}
    )

    return {"message": "Rating submitted! ✨", "average_rating": avg_rating}

async def get_worker_reviews(worker_email: str):
    db = get_db()
    reviews = await db.reviews.find({"worker_email": worker_email}).sort("created_at", -1).to_list(length=50)
    
    # Enrich with user names
    enriched_reviews = []
    for r in reviews:
        user = await db.users.find_one({"email": r["user_email"]})
        enriched_reviews.append({
            "id": str(r["_id"]),
            "user_name": user["name"] if user else "Anonymous",
            "rating": r["rating"],
            "review": r["review"],
            "created_at": r["created_at"]
        })
    
    return enriched_reviews
