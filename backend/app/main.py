from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.workers import router as workers_router
from app.routes.bookings import router as bookings_router
from app.routes.review import router as reviews_router
from app.routes.worker import router as worker_router
from app.database import connect_to_mongo, close_mongo_connection
from fastapi.staticfiles import StaticFiles
import os
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_to_mongo()
    yield
    # Shutdown: Close connection
    await close_mongo_connection()

app = FastAPI(
    title="WorkConnect API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include Routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(workers_router, prefix="/workers", tags=["Workers"])
app.include_router(bookings_router, prefix="/bookings", tags=["Bookings"])
app.include_router(reviews_router, prefix="/reviews", tags=["Reviews"])
app.include_router(worker_router, prefix="/worker", tags=["Worker Dashboard"])

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "WorkConnect Backend is running",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
