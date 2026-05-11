from fastapi import APIRouter, HTTPException, Body
from app.database import get_db
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId

router = APIRouter()

class Notification(BaseModel):
    user_email: str
    title: str
    message: str
    type: str  # booking, alert, offer, info
    read: bool = False
    link: Optional[str] = None
    created_at: Optional[str] = None

@router.post("/")
async def create_notification(data: Notification):
    db = get_db()
    notif_dict = data.dict()
    notif_dict["created_at"] = datetime.utcnow().isoformat()
    result = await db.notifications.insert_one(notif_dict)
    return {"id": str(result.inserted_id)}

@router.get("/{email}")
async def get_notifications(email: str):
    db = get_db()
    notifs = await db.notifications.find({"user_email": email}).sort("created_at", -1).to_list(100)
    for n in notifs:
        n["id"] = str(n["_id"])
        del n["_id"]
    return notifs

@router.put("/{notif_id}/read")
async def mark_as_read(notif_id: str):
    db = get_db()
    await db.notifications.update_one(
        {"_id": ObjectId(notif_id)},
        {"$set": {"read": True}}
    )
    return {"message": "Marked as read"}

@router.put("/mark-all-read/{email}")
async def mark_all_read(email: str):
    db = get_db()
    await db.notifications.update_many(
        {"user_email": email},
        {"$set": {"read": True}}
    )
    return {"message": "All notifications marked as read"}
