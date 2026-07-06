from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, UserProfile
from app.schemas.user import UserCreate, UserResponse
from app.schemas.common import ResponseModel
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=ResponseModel[UserResponse])
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Auto create profile
    profile = UserProfile(user_id=user.id)
    db.add(profile)
    db.commit()
    
    return ResponseModel(message="Registration successful", data=user)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=ResponseModel[UserResponse])
def get_me(current_user: User = Depends(get_current_user)):
    return ResponseModel(data=current_user)