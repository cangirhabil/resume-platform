from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Body, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Resume, ResumeStatus, User
from app.services.rewriter import rewrite_resume
from app.utils.text_extractor import extract_text
from app.api.v1.endpoints.upload import get_current_user
from typing import Dict, Optional
import os
import traceback

router = APIRouter()

async def process_rewrite(
    resume_id: int, 
    answers: Dict[str, str], 
    template: str, 
    db: Session, 
    api_keys: dict = None,
    provider: str = None,
    model: str = None
):
    """Background task to rewrite resume and generate PDF/DOCX."""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        return
    
    resume.status = ResumeStatus.GENERATING
    db.commit()
    
    try:
        # Extract Text
        text = await extract_text(resume.s3_key_original)
        
        # Rewrite with LLM
        analysis = resume.analysis_result or {}
        
        rewritten_content = await rewrite_resume(
            text, 
            analysis, 
            answers, 
            api_keys,
            provider=provider,
            model=model
        )
        
        # Store rewritten content in analysis_result for reference
        resume.analysis_result = {
            **analysis,
            "rewritten_content": rewritten_content
        }
        
        # GENERATE PDF and DOCX
        from app.services.pdf_generator import pdf_generator
        from app.core.storage import storage
        
        pdf_bytes = pdf_generator.generate(rewritten_content, theme=template)
        docx_bytes = pdf_generator.generate_docx(rewritten_content)
        
        # SAVE FILES
        pdf_filename = f"{resume.user_id}/generated_{resume.id}.pdf"
        docx_filename = f"{resume.user_id}/generated_{resume.id}.docx"
        
        # Save to local storage
        if storage.local_storage_path:
            # PDF
            pdf_path = os.path.join(storage.local_storage_path, pdf_filename)
            os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
            with open(pdf_path, "wb") as f:
                f.write(pdf_bytes)
            
            # DOCX
            docx_path = os.path.join(storage.local_storage_path, docx_filename)
            with open(docx_path, "wb") as f:
                f.write(docx_bytes)
        
        # UPDATE DB
        resume.s3_key_generated_pdf = pdf_filename
        resume.s3_key_generated_docx = docx_filename
        resume.status = ResumeStatus.COMPLETED
        db.commit()
        
    except Exception as e:
        print(f"Rewrite Failed: {e}")
        traceback.print_exc()
        resume.analysis_result = {
            **(resume.analysis_result or {}),
            "rewrite_error": str(e)
        }
        resume.status = ResumeStatus.FAILED
        db.commit()

class RewriteRequest(BaseModel):
    answers: Dict[str, str]
    template: Optional[str] = "professional"

@router.post("/{resume_id}/rewrite")
async def start_rewrite(
    resume_id: int, 
    request_body: RewriteRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start AI rewrite of a resume."""
    answers = request_body.answers
    template = request_body.template or "modern"
    
    # Validate template
    valid_templates = ["professional", "modern", "classic", "minimal"]
    if template not in valid_templates:
        template = "professional"
    
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Extract all config from headers
    api_keys = {
        "openai": request.headers.get("x-openai-key"),
        "google": request.headers.get("x-google-key"),
        "anthropic": request.headers.get("x-anthropic-key")
    }
    provider = request.headers.get("x-llm-provider")
    model = request.headers.get("x-llm-model")
    
    background_tasks.add_task(
        process_rewrite, 
        resume.id, 
        answers, 
        template, 
        db, 
        api_keys,
        provider,
        model
    )
    
    return {"message": "Rewrite started", "status": "generating", "template": template}
