from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from fastapi import HTTPException, status

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    try:
        db_instance.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000
        )
        db_instance.db = db_instance.client[settings.DB_NAME]
        # Verify connection
        await db_instance.client.admin.command('ping')
        print("Connected to MongoDB! 🚀")
    except Exception as e:
        print(f"Could not connect to MongoDB: {str(e)}")

async def close_mongo_connection():
    db_instance.client.close()
    print("Closed MongoDB connection!")

def get_db():
    if db_instance.db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not established. Please check if MongoDB is running."
        )
    return db_instance.db
