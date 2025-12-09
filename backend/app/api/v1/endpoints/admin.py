from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models import User, Resume, CreditTransaction
from app.api.v1.endpoints.upload import get_current_user
from typing import Optional
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

def require_superuser(current_user: User = Depends(get_current_user)):
    """Dependency to require superuser access."""
    if not current_user.is_superuser:
        logger.warning(f"Unauthorized admin access attempt by user {current_user.id} ({current_user.email})")
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/verify")
def verify_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify if user has admin privileges. Used for admin login flow."""
    is_admin = current_user.is_superuser
    
    if not is_admin:
        logger.warning(f"Admin verification failed for user {current_user.id} ({current_user.email})")
    
    return {
        "is_admin": is_admin,
        "user_id": current_user.id,
        "email": current_user.email
    }

@router.get("/stats")
def get_admin_stats(
    current_user: User = Depends(require_superuser),
    db: Session = Depends(get_db)
):
    """Get system statistics for admin dashboard."""
    total_users = db.query(func.count(User.id)).scalar()
    total_resumes = db.query(func.count(Resume.id)).scalar()
    
    # Calculate total revenue from credit purchases
    total_revenue = db.query(func.sum(CreditTransaction.amount)).filter(
        CreditTransaction.amount > 0,
        CreditTransaction.stripe_payment_id.isnot(None)
    ).scalar() or 0
    
    # Each credit purchase is $4 (5 credits for $20)
    revenue_dollars = (total_revenue / 5) * 20 if total_revenue else 0
    
    # Resume status breakdown
    status_counts = db.query(
        Resume.status, 
        func.count(Resume.id)
    ).group_by(Resume.status).all()
    
    status_breakdown = {str(status.value) if status else "unknown": count for status, count in status_counts}
    
    return {
        "users": total_users,
        "resumes": total_resumes,
        "revenue": revenue_dollars,
        "status_breakdown": status_breakdown
    }

@router.get("/users")
def list_users(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(require_superuser),
    db: Session = Depends(get_db)
):
    """List all users with pagination."""
    users = db.query(User).offset(skip).limit(limit).all()
    total = db.query(func.count(User.id)).scalar()
    
    return {
        "total": total,
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "is_active": u.is_active,
                "is_superuser": u.is_superuser,
                "credits": u.credits,
                "created_at": u.created_at.isoformat() if u.created_at else None,
                "resume_count": len(u.resumes) if u.resumes else 0
            }
            for u in users
        ]
    }

@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    is_active: Optional[bool] = None,
    is_superuser: Optional[bool] = None,
    credits: Optional[int] = None,
    current_user: User = Depends(require_superuser),
    db: Session = Depends(get_db)
):
    """Update user properties (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Log admin action
    logger.info(f"Admin {current_user.id} updating user {user_id}: is_active={is_active}, is_superuser={is_superuser}, credits={credits}")
    
    if is_active is not None:
        user.is_active = is_active
    if is_superuser is not None:
        user.is_superuser = is_superuser
    if credits is not None:
        user.credits = credits
    
    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "email": user.email,
        "is_active": user.is_active,
        "is_superuser": user.is_superuser,
        "credits": user.credits
    }

@router.get("/resumes")
def list_all_resumes(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(require_superuser),
    db: Session = Depends(get_db)
):
    """List all resumes with user info (admin only)."""
    resumes = db.query(Resume).order_by(Resume.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(func.count(Resume.id)).scalar()
    
    return {
        "total": total,
        "resumes": [
            {
                "id": r.id,
                "user_id": r.user_id,
                "user_email": r.owner.email if r.owner else "Unknown",
                "original_filename": r.original_filename,
                "status": r.status.value if r.status else "unknown",
                "score": r.analysis_result.get("score") if r.analysis_result else None,
                "created_at": r.created_at.isoformat() if r.created_at else None
            }
            for r in resumes
        ]
    }
