# WorkConnect Backend 🚀

Professional FastAPI Backend for Service Marketplace.

## Tech Stack
- **Framework:** FastAPI
- **Database:** MongoDB (Motor)
- **Auth:** JWT (python-jose, passlib)
- **Validation:** Pydantic

## Project Structure
- `app/main.py`: Entry point
- `app/routes/`: API endpoints
- `app/models/`: Database models
- `app/services/`: Business logic
- `app/ai/`: Smart matching and recommendations

## Getting Started
1. Install dependencies: `pip install -r requirements.txt`
2. Run server: `uvicorn app.main:app --reload`
