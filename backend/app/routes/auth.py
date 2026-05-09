from app.schemas.auth_schema import RegisterSchema, LoginSchema, TokenResponse
from app.services.auth_service import register_user, login_user
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from typing import List, Optional
import shutil
import os
import json
import uuid

router = APIRouter()

@router.post("/register")
async def register(
    data: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    id_proof: Optional[UploadFile] = File(None)
):
    try:
        # Parse JSON string data from Form
        try:
            user_data_dict = json.loads(data)
            user_data = RegisterSchema(**user_data_dict)
        except Exception as e:
            print(f"JSON Parsing Error: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid form data format: {str(e)}")

        photo_path = None
        if photo and photo.filename:
            try:
                file_extension = os.path.splitext(photo.filename)[1]
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                photo_path = os.path.join("uploads", unique_filename).replace("\\", "/")
                with open(photo_path, "wb") as buffer:
                    shutil.copyfileobj(photo.file, buffer)
            except Exception as e:
                print(f"Photo Save Error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Failed to save photo: {str(e)}")

        id_proof_path = None
        if id_proof and id_proof.filename:
            try:
                file_extension = os.path.splitext(id_proof.filename)[1]
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                id_proof_path = os.path.join("uploads", unique_filename).replace("\\", "/")
                with open(id_proof_path, "wb") as buffer:
                    shutil.copyfileobj(id_proof.file, buffer)
            except Exception as e:
                print(f"ID Proof Save Error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Failed to save ID proof: {str(e)}")

        return await register_user(user_data, photo_path, id_proof_path)
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Registration General Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginSchema):
    return await login_user(data)

@router.put("/update-profile")
async def update_profile(
    email: str = Form(...),
    address: Optional[str] = Form(None),
    experience: Optional[int] = Form(None),
    skills: Optional[str] = Form(None), # JSON string from frontend
    photo: Optional[UploadFile] = File(None),
    id_proof: Optional[UploadFile] = File(None)
):
    try:
        from app.services.auth_service import update_user_profile
        
        update_data = {"email": email}
        if address is not None: update_data["address"] = address
        if experience is not None: update_data["experience"] = experience
        if skills is not None: update_data["skills"] = json.loads(skills)

        if photo and photo.filename:
            file_extension = os.path.splitext(photo.filename)[1]
            unique_filename = f"profile_{uuid.uuid4()}{file_extension}"
            photo_path = os.path.join("uploads", unique_filename).replace("\\", "/")
            with open(photo_path, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)
            update_data["photo"] = photo_path

        if id_proof and id_proof.filename:
            file_extension = os.path.splitext(id_proof.filename)[1]
            unique_filename = f"id_{uuid.uuid4()}{file_extension}"
            id_path = os.path.join("uploads", unique_filename).replace("\\", "/")
            with open(id_path, "wb") as buffer:
                shutil.copyfileobj(id_proof.file, buffer)
            update_data["id_proof"] = id_path

        return await update_user_profile(update_data)
    except Exception as e:
        print(f"Update Profile Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")
