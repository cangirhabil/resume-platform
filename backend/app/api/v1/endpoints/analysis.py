from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Resume, ResumeStatus, User
from app.core import security
from app.utils.text_extractor import extract_text
from app.services.analyzer import analyze_resume_text
from app.api.v1.endpoints.upload import get_current_user
import json

router = APIRouter()

async def process_analysis(resume_id: int, db: Session):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        return
        
    resume.status = ResumeStatus.ANALYZING
    db.commit()
    
    try:
        # Extract Text
        text = await extract_text(resume.s3_key_original)
        
        # Analyze with LLM
        analysis_result = await analyze_resume_text(text)
        
        # Save Result
        resume.analysis_result = analysis_result
        resume.status = ResumeStatus.WAITING_INPUT
        
        db.commit()
    except Exception as e:
        print(f"Analysis Failed: {e}")
        resume.status = ResumeStatus.FAILED
        db.commit()

@router.post("/{resume_id}/analyze")
async def start_analysis(
    resume_id: int, 
    background_tasks: BackgroundTasks,
    request: Request, # Get Request object
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.credits < 1:
        raise HTTPException(status_code=402, detail="Insufficient credits")

    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    # Deduct Credit
    current_user.credits -= 1
    trx = CreditTransaction(
        user_id=current_user.id,
        amount=-1,
        description=f"Analysis for Resume #{resume.id}"
    )
    db.add(trx)
    db.commit() # Commit deduction immediately

    # Extract Keys from Headers
    openai_key = request.headers.get("x-openai-key")
    google_key = request.headers.get("x-google-key")
    api_keys = {"openai": openai_key, "google": google_key}

    background_tasks.add_task(process_analysis, resume.id, db, api_keys)
    
    return {"message": "Analysis started", "status": "analyzing"}
