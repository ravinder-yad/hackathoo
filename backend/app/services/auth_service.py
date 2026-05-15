from app.database import get_db
from app.utils.jwt_handler import get_password_hash, verify_password, create_access_token
from app.schemas.auth_schema import RegisterSchema, LoginSchema
from fastapi import HTTPException, status
from datetime import datetime

async def register_user(data: RegisterSchema, photo_path: str = None, id_proof_path: str = None):
    db = get_db()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    if len(data.password) > 72:
        raise HTTPException(status_code=400, detail="Password must be under 72 characters")
        
    print(f"SERVICE DEBUG: Password to hash (first 5 chars): {data.password[:5]}... Length: {len(data.password)}")
    hashed_password = get_password_hash(data.password)
    
    # Prepare user object
    user_dict = {
        "name": data.name,
        "email": data.email,
        "password": hashed_password,
        "role": data.role,
        "phone": data.phone,
        "address": data.address,
        "created_at": data.joined_at if data.joined_at else datetime.utcnow().isoformat(),
        "photo": photo_path,
        "id_proof": id_proof_path
    }
    
    # If worker, add extra fields
    if data.role == "worker":
        user_dict["skills"] = data.skills
        user_dict["experience"] = data.experience
        user_dict["verified"] = False
    
    await db.users.insert_one(user_dict)
    
    # Prepend server URL to photo path for frontend
    base_url = "http://localhost:8000"
    full_photo_url = f"{base_url}/{photo_path}" if photo_path else None
        
    # Create token for auto-login
    token = create_access_token(data={"sub": data.email, "role": data.role})
    
    return {
        "message": "Registration successful! Welcome to HireAgain 🚀",
        "access_token": token,
        "token_type": "bearer",
        "role": data.role,
        "name": data.name,
        "email": data.email,
        "photo": full_photo_url,
        "phone": data.phone,
        "address": data.address,
        "experience": data.experience if data.role == "worker" else 0
    }

async def login_user(data: LoginSchema):
    db = get_db()
    
    # Find user by email
    user = await db.users.find_one({"email": data.email})
    
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token
    token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    
    # Prepend server URL to photo path
    base_url = "http://localhost:8000"
    photo_path = user.get("photo")
    full_photo_url = f"{base_url}/{photo_path}" if photo_path else None

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
        "name": user["name"],
        "email": user["email"],
        "phone": user.get("phone"),
        "address": user.get("address"),
        "photo": full_photo_url,
        "joined_at": user.get("created_at"),
        "experience": user.get("experience", 0)
    }

async def update_user_profile(data: dict):
    db = get_db()
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
        
    # Prepare update data (remove email from fields to update)
    update_data = {k: v for k, v in data.items() if k != "email"}
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Fetch updated user
    updated_user = await db.users.find_one({"email": email})
    
    # Prepend server URL to photo path if exists
    base_url = "http://localhost:8000"
    photo_path = updated_user.get("photo")
    full_photo_url = f"{base_url}/{photo_path}" if photo_path else None

    return {
        "message": "Profile updated successfully! ✨",
        "user": {
            "name": updated_user["name"],
            "email": updated_user["email"],
            "role": updated_user["role"],
            "phone": updated_user.get("phone"),
            "address": updated_user.get("address"),
            "photo": full_photo_url,
            "skills": updated_user.get("skills", []),
            "experience": updated_user.get("experience", 0)
        }
    }
