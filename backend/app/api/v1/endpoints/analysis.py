from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Resume, ResumeStatus, User, CreditTransaction
from app.core import security
from app.utils.text_extractor import extract_text
from app.services.analyzer import analyze_resume_text
from app.api.v1.endpoints.upload import get_current_user
import json
import traceback

router = APIRouter()

async def process_analysis(resume_id: int, db: Session, api_keys: dict = None, provider: str = None, model: str = None):
    """Background task to process resume analysis."""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        return
        
    resume.status = ResumeStatus.ANALYZING
    db.commit()
    
    try:
        # Extract Text from uploaded file
        text = await extract_text(resume.s3_key_original)
        
        if not text or len(text.strip()) < 50:
            raise ValueError("Could not extract sufficient text from the resume. Please upload a valid PDF or DOCX file.")
        
        # Analyze with LLM
        analysis_result = await analyze_resume_text(
            text, 
            api_keys,
            provider=provider,
            model=model
        )
        
        # Save Result
        resume.analysis_result = analysis_result
        resume.status = ResumeStatus.WAITING_INPUT
        
        db.commit()
    except ValueError as e:
        # User-friendly errors
        print(f"Analysis Failed (ValueError): {e}")
        resume.analysis_result = {"error": str(e)}
        resume.status = ResumeStatus.FAILED
        db.commit()
    except Exception as e:
        print(f"Analysis Failed: {e}")
        traceback.print_exc()
        resume.analysis_result = {"error": f"Analysis failed: {str(e)}"}
        resume.status = ResumeStatus.FAILED
        db.commit()

@router.post("/{resume_id}/analyze")
async def start_analysis(
    resume_id: int, 
    background_tasks: BackgroundTasks,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start AI analysis of a resume."""
    if current_user.credits < 1:
        raise HTTPException(status_code=402, detail="Insufficient credits. Please purchase more credits to continue.")

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
    db.commit()

    # Extract all config from headers
    api_keys = {
        "openai": request.headers.get("x-openai-key"),
        "google": request.headers.get("x-google-key"),
        "anthropic": request.headers.get("x-anthropic-key")
    }
    provider = request.headers.get("x-llm-provider")
    model = request.headers.get("x-llm-model")

    background_tasks.add_task(process_analysis, resume.id, db, api_keys, provider, model)
    
    return {"message": "Analysis started", "status": "analyzing"}

@router.get("/{resume_id}/analysis")
def get_analysis(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analysis results for a resume."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return {
        "status": resume.status.value if resume.status else "unknown",
        "analysis_result": resume.analysis_result,
        "has_error": resume.analysis_result.get("error") if resume.analysis_result else None
    }
