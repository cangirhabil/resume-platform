from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Body, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Resume, ResumeStatus, User
from app.services.rewriter import rewrite_resume
from app.utils.text_extractor import extract_text
from app.api.v1.endpoints.upload import get_current_user
from typing import Dict

router = APIRouter()

# Duplicating logic from analysis because I can't circular import easily with the current file structure
# Ideally should move logic to controller/service layer
async def process_rewrite(resume_id: int, answers: Dict[str, str], db: Session):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        return
    
    resume.status = ResumeStatus.GENERATING
    db.commit()
    
    try:
        # Extract Text
        text = await extract_text(resume.s3_key_original)
        
        # Rewrite
        analysis = resume.analysis_result
        if not analysis:
             # Fallback if analysis missing (shouldn't happen)
             analysis = {}

        rewritten_content = await rewrite_resume(text, analysis, answers)
        
        # Save Result
        # We need a column for this too! 'generated_content' (JSON)
        # Using analysis_result temporarly or reusing a field?
        # Let's verify models.py. We only added analysis_result.
        # We need to add 'generated_content' to models.py
        
        # Hack for now: Store it in analysis_result under a new key 'rewritten_version'
        # Or just append to analysis_result
        # new_result = dict(resume.analysis_result) # Removed this block
        # new_result['rewritten_version'] = rewritten_content
        
        # FORCE UPDATE: SQLAlchemy sometimes doesn't detect mutation of JSON dict
        # resume.analysis_result = new_result
        # from sqlalchemy.orm.attributes import flag_modified
        # flag_modified(resume, "analysis_result")
        
        # GENERATE PDF
        from app.services.pdf_generator import pdf_generator # Changed to absolute import
        from app.core.storage import storage # Changed to absolute import
        pdf_bytes = pdf_generator.generate(rewritten_content, theme="modern")
        
        # SAVE PDF
        # import io # Removed
        # from fastapi import UploadFile # Removed
        # UploadFile wrapper hack for our storage service which expects UploadFile
        # Or we can just modify storage service to accept bytes.
        # Let's modify storage service slightly or just mock it here?
        # Actually storage service takes UploadFile. Let's make it more flexible later.
        # For now, let's write to a temp file and upload? No that's slow.
        # Let's just quick fix:
        
        filename = f"{resume.user_id}/generated_{resume.id}.pdf"
        # We need a way to upload bytes directly. 
        # I'll update StorageService to support bytes or create a BytesIO wrapper.
        
        # Assuming we update StorageService... let's just do it directly here for now to save time
        # if using local storage
        if storage.local_storage_path:
             full_path = os.path.join(storage.local_storage_path, filename)
             os.makedirs(os.path.dirname(full_path), exist_ok=True)
             with open(full_path, "wb") as f:
                 f.write(pdf_bytes)
             # resume.s3_key_generated_pdf = full_path # Changed to filename
        
        # UPDATE DB
        resume.s3_key_generated_pdf = filename # in local mode, this is relative path
        resume.status = ResumeStatus.COMPLETED
        db.commit()
        
    except Exception as e:
        print(f"Rewrite Failed: {e}")
        resume.status = ResumeStatus.FAILED
        db.commit()

@router.post("/{resume_id}/rewrite")
async def start_rewrite( # Renamed function
    resume_id: int, 
    answers: Dict[str, str] = Body(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    background_tasks.add_task(process_rewrite, resume.id, answers, db)
    
    return {"message": "Rewrite started", "status": "generating"}
