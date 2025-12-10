from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.db.session import get_db, SessionLocal

from app.models import Resume, ResumeStatus, User, CreditTransaction
from app.core import security
from app.utils.text_extractor import extract_text
from app.services.analyzer import analyze_resume_text
from app.api.v1.endpoints.upload import get_current_user
import json
import traceback
import logging
import sys

# Configure logging for Uvicorn/FastAPI environment
logger = logging.getLogger("resume_analysis")
logger.setLevel(logging.INFO)

# Avoid adding multiple handlers if module reloaded
if not logger.handlers:
    file_handler = logging.FileHandler('/tmp/resume_backend.log')
    file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))
    logger.addHandler(file_handler)
    # Also log to stdout for docker/terminal logs
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))
    logger.addHandler(stream_handler)

# Use 'logger' instead of 'logging' in functions below if needed, 
# but since previous code uses logging.info/error which uses root logger,
# we should attach handler to root logger or update calls.
# Easier: Attach to root logger? No, uvicorn configures root.
# Let's attach to the logger used in this module. 
# BUT the code uses `logging.info(...)`. I must change `logging.info` to `logger.info` OR add handler to root.
# safest is add to root logger but force it.

root_logger = logging.getLogger()
has_file_handler = any(isinstance(h, logging.FileHandler) and h.baseFilename == '/tmp/resume_backend.log' for h in root_logger.handlers)
if not has_file_handler:
    root_log_handler = logging.FileHandler('/tmp/resume_backend.log')
    root_log_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))
    root_logger.addHandler(root_log_handler)

router = APIRouter()

class AnalysisRequest(BaseModel):
    job_posting: Optional[str] = None
    template: Optional[str] = "professional"

async def process_analysis(
    resume_id: int, 
    # db: Session removed - creating new session
    api_keys: dict = None, 
    provider: str = None, 
    model: str = None,
    job_posting: str = None,
    template: str = "professional"
):
    """Background task to process resume analysis."""
    # Create new DB session for background task
    db = SessionLocal()
    
    try:
        logging.info(f"Starting analysis for resume {resume_id}")
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            logging.error("Resume not found")
            return
            
        resume.status = ResumeStatus.ANALYZING
        db.commit()
        
        # Extract Text from uploaded file
        logging.info(f"Extracting text from {resume.s3_key_original}")
        text = await extract_text(resume.s3_key_original)
        
        if not text or len(text.strip()) < 50:
            raise ValueError("Could not extract sufficient text from the resume. Please upload a valid PDF or DOCX file.")
        
        logging.info(f"Text extracted, length: {len(text)}. Starting LLM analysis.")
        
        # Analyze with LLM - pass job_posting and template for context-aware questions
        analysis_result = await analyze_resume_text(
            text, 
            api_keys,
            provider=provider,
            model=model,
            job_posting=job_posting,
            template=template
        )
        
        logging.info("LLM analysis complete")
        
        # Save Result
        resume.analysis_result = analysis_result
        resume.status = ResumeStatus.WAITING_INPUT
        
        db.commit()
    except ValueError as e:
        # User-friendly errors
        logging.error(f"Analysis Failed (ValueError): {e}")
        try:
            resume.analysis_result = {"error": str(e)}
            resume.status = ResumeStatus.FAILED
            db.commit()
        except:
            pass
    except Exception as e:
        logging.error(f"Analysis Failed: {e}", exc_info=True)
        try:
            resume.analysis_result = {"error": f"Analysis failed: {str(e)}"}
            resume.status = ResumeStatus.FAILED
            db.commit()
        except:
            pass
    finally:
        db.close()

@router.post("/{resume_id}/analyze")
async def start_analysis(
    resume_id: int, 
    background_tasks: BackgroundTasks,
    request: Request,
    request_body: AnalysisRequest = None,
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
    
    # Get job_posting and template from request body
    job_posting = request_body.job_posting if request_body else None
    template = request_body.template if request_body else "professional"

    background_tasks.add_task(
        process_analysis, 
        resume.id, 
        # db removed
        api_keys, 
        provider, 
        model,
        job_posting,
        template
    )
    
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
