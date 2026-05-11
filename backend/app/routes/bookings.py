from fastapi import APIRouter, HTTPException, Body
from app.database import get_db
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from bson import ObjectId

import random

router = APIRouter()

class BookingCreate(BaseModel):
    user_email: str
    worker_email: str
    worker_name: str
    service: str
    date: str
    time: str
    price: Optional[int] = 500
    address: str
    priority: Optional[str] = "normal"
    type: Optional[str] = "standard"

@router.post("/")
async def create_booking(data: BookingCreate):
    db = get_db()
    
    booking_dict = data.dict()
    booking_dict["status"] = "pending"
    booking_dict["otp"] = str(random.randint(1000, 9999))
    booking_dict["created_at"] = datetime.utcnow().isoformat()
    
    result = await db.bookings.insert_one(booking_dict)
    
    return {
        "message": "Booking request sent! 🚀",
        "booking_id": str(result.inserted_id)
    }

@router.get("/user/{email}")
async def get_user_bookings(email: str):
    db = get_db()
    bookings = await db.bookings.find({"user_email": email}).sort("created_at", -1).to_list(100)
    for b in bookings:
        b["id"] = str(b["_id"])
        del b["_id"]
    return bookings

@router.get("/worker/{email}")
async def get_worker_bookings(email: str):
    db = get_db()
    bookings = await db.bookings.find({"worker_email": email}).sort("created_at", -1).to_list(100)
    for b in bookings:
        b["id"] = str(b["_id"])
        del b["_id"]
    return bookings

@router.put("/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str = Body(...)):
    db = get_db()
    try:
        await db.bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"status": status}}
        )
        return {"message": f"Status updated to {status}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid booking ID")
@router.delete("/{booking_id}")
async def cancel_booking(booking_id: str):
    db = get_db()
    try:
        result = await db.bookings.delete_one({"_id": ObjectId(booking_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Booking not found")
        return {"message": "Booking cancelled successfully! 🔴"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid booking ID")
