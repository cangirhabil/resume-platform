from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.core import security
from app.db.session import get_db
from app.models import User, CreditTransaction

router = APIRouter()

@router.post("/register", response_model=dict)
def register(user_in: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Note: Using OAuth2 form for convenience, usually cleaner to use Pydantic models (UserCreate)
    # But for MVP speed, reusing the form for email/password. 
    # Actually, let's just stick to email/password from body to be cleaner for a REST API.
    pass 
    # Logic moved to separate function below for clarity, need Pydantic models.

# Quick Pydantic models for Auth
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/signup", response_model=Token)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        credits=3 # Free credits on signup
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Record transaction
    trx = CreditTransaction(user_id=user.id, amount=3, description="Signup Bonus")
    db.add(trx)
    db.commit()
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

from app.api.v1.endpoints.upload import get_current_user # Re-using dependency. Ideally move to common deps.

@router.get("/me", response_model=dict)
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "credits": current_user.credits,
        "is_superuser": current_user.is_superuser
    }
