from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from app.core import security
from app.db.session import get_db
from app.models import User, CreditTransaction
from collections import defaultdict
import time
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Rate limiting: track failed login attempts
failed_attempts: dict = defaultdict(list)
MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

def check_rate_limit(ip: str, email: str) -> bool:
    """Check if IP/email is rate limited due to failed attempts."""
    now = time.time()
    key = f"{ip}:{email}"
    
    # Clean old attempts (older than lockout period)
    failed_attempts[key] = [t for t in failed_attempts[key] if now - t < LOCKOUT_MINUTES * 60]
    
    if len(failed_attempts[key]) >= MAX_ATTEMPTS:
        return False  # Rate limited
    return True

def record_failed_attempt(ip: str, email: str):
    """Record a failed login attempt."""
    key = f"{ip}:{email}"
    failed_attempts[key].append(time.time())
    logger.warning(f"Failed login attempt for {email} from {ip}. Attempts: {len(failed_attempts[key])}")

def clear_attempts(ip: str, email: str):
    """Clear failed attempts after successful login."""
    key = f"{ip}:{email}"
    failed_attempts.pop(key, None)

# Pydantic models
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=dict)
def register(user_in: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    pass

@router.post("/signup", response_model=Token)
def signup(user_in: UserCreate, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    
    # Check for existing user
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Password validation
    if len(user_in.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long.",
        )
    
    user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        credits=3  # Free credits on signup
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    logger.info(f"New user registered: {user.email} from {ip}")
    
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
def login(form_data: OAuth2PasswordRequestForm = Depends(), request: Request = None, db: Session = Depends(get_db)):
    ip = request.client.host if request and request.client else "unknown"
    email = form_data.username
    
    # Rate limiting check
    if not check_rate_limit(ip, email):
        logger.warning(f"Rate limit exceeded for {email} from {ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed attempts. Please try again in {LOCKOUT_MINUTES} minutes.",
        )
    
    user = db.query(User).filter(User.email == email).first()
    
    # Check credentials
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        record_failed_attempt(ip, email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact support.",
        )
    
    # Successful login - clear failed attempts
    clear_attempts(ip, email)
    logger.info(f"User logged in: {user.email} from {ip}")
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

from app.api.v1.endpoints.upload import get_current_user

@router.get("/me", response_model=dict)
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "credits": current_user.credits,
        "is_superuser": current_user.is_superuser
    }
