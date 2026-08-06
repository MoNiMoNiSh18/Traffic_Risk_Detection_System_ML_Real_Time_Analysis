from fastapi import APIRouter, HTTPException
from app.auth.schemas import UserRegister, UserResponse
from app.auth.service import hash_password
from app.db.database import SessionLocal
from app.db.crud import create_user, get_user_by_email

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse)
def register(user: UserRegister):
    db = SessionLocal()

    existing_user = get_user_by_email(db, user.email)

    if existing_user:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user_data = user.model_dump()

    user_data["hashed_password"] = hash_password(user_data.pop("password"))

    new_user = create_user(db, user_data)

    db.close()

    return new_user