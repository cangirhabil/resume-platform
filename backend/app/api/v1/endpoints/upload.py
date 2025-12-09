from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.storage import storage
from app.db.session import get_db
from app.models import User, Resume, ResumeStatus
from app.core import security
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
import uuid
import os

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    # Simple JWT decode for now, verify in DB
    try:
        payload = security.jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
             raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are allowed")

    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{current_user.id}/{uuid.uuid4()}{file_ext}"
    
    # Upload
    location = await storage.save_file(file, unique_filename)
    
    # Create Record
    resume = Resume(
        user_id=current_user.id,
        original_filename=file.filename,
        s3_key_original=location,
        status=ResumeStatus.UPLOADED
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    
    # Trigger Analysis (Async background task would be better here)
    # For MVP, we can just return and let client poll or trigger manually.
    # We'll return the ID so the client can call /analyze endpoint.
    
    return {"id": resume.id, "status": resume.status, "filename": resume.original_filename}

@router.get("/{resume_id}")
def get_resume(
    resume_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
