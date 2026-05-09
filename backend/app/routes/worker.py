from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from datetime import datetime

router = APIRouter(tags=["worker"])

@router.get("/stats/{email}")
async def get_worker_stats(email: str):
    db = get_db()
    
    # Get worker details
    worker = await db.users.find_one({"email": email, "role": "worker"})
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
        
    # Get bookings
    bookings = await db.bookings.find({"worker_email": email}).to_list(None)
    
    total_jobs = len(bookings)
    # Filter completed jobs for earnings
    completed_bookings = [b for b in bookings if b.get("status") == "Completed"]
    
    # Calculate earnings (assuming a fixed rate or stored price in booking)
    # For now, let's assume each job is ₹500 if not specified
    total_earnings = sum([int(b.get("price", 500)) for b in completed_bookings])
    
    # Calculate today's earnings
    today_dt = datetime.now()
    today_str = today_dt.strftime("%d/%m/%Y")
    today_earnings = sum([int(b.get("price", 500)) for b in completed_bookings if b.get("date") == today_str])

    # Weekly Breakdown (Last 7 Days)
    from datetime import timedelta
    weekly_breakdown = []
    for i in range(6, -1, -1):
        day_dt = today_dt - timedelta(days=i)
        day_str = day_dt.strftime("%d/%m/%Y")
        day_name = day_dt.strftime("%A")
        if i == 0: day_name += " (Today)"
        
        day_bookings = [b for b in completed_bookings if b.get("date") == day_str]
        day_amount = sum([int(b.get("price", 500)) for b in day_bookings])
        
        weekly_breakdown.append({
            "day": day_name,
            "amount": day_amount,
            "jobs": len(day_bookings),
            "percentage": min((day_amount / 2000) * 100, 100) if day_amount > 0 else 5 # Scale relative to 2000 goal
        })

    return {
        "total_jobs": total_jobs,
        "total_earnings": total_earnings,
        "today_earnings": today_earnings,
        "this_week_earnings": sum([d["amount"] for d in weekly_breakdown]),
        "this_month_earnings": total_earnings, # For demo, we use total as month
        "weekly_breakdown": weekly_breakdown,
        "average_rating": worker.get("average_rating", 0),
        "total_reviews": worker.get("total_reviews", 0),
        "is_online": worker.get("is_online", True),
        "verified": worker.get("verified", False),
        "experience": worker.get("experience", 0),
        "skills": worker.get("skills", [])
    }

@router.post("/status")
async def toggle_status(data: dict):
    db = get_db()
    email = data.get("email")
    is_online = data.get("is_online")
    
    if email is None or is_online is None:
        raise HTTPException(status_code=400, detail="Email and status are required")
        
    await db.users.update_one(
        {"email": email, "role": "worker"},
        {"$set": {"is_online": is_online}}
    )
    
    return {"message": "Status updated", "is_online": is_online}

@router.get("/history/{email}")
async def get_worker_history(email: str):
    db = get_db()
    bookings = await db.bookings.find({"worker_email": email}).sort("_id", -1).to_list(10)
    
    # Convert MongoDB ObjectId to string
    for b in bookings:
        b["id"] = str(b["_id"])
        del b["_id"]
        
    return bookings
