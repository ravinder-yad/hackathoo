from fastapi import APIRouter, HTTPException, Query
from app.database import get_db
from typing import List, Optional

router = APIRouter()

@router.get("/")
async def get_workers(
    skill: Optional[str] = None,
    min_rating: Optional[float] = None,
    location: Optional[str] = None
):
    db = get_db()
    query = {"role": "worker", "is_online": {"$ne": False}}
    
    if skill:
        query["skills"] = {"$in": [skill]}
    if min_rating:
        query["rating"] = {"$gte": min_rating}
    if location:
        query["address"] = {"$regex": location, "$options": "i"}
        
    workers = await db.users.find(query).to_list(100)
    
    # Format for frontend (ensure photo URLs are correct)
    base_url = "http://localhost:8000"
    formatted_workers = []
    for w in workers:
        photo_path = w.get("photo")
        w["id"] = str(w["_id"])
        w["photo"] = f"{base_url}/{photo_path}" if photo_path else None
        del w["_id"]
        del w["password"]
        formatted_workers.append(w)
        
    return formatted_workers
