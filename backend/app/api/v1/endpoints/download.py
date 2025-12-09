from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Resume, User
from app.api.v1.endpoints.upload import get_current_user
import os

router = APIRouter()

@router.get("/{resume_id}/download")
def download_resume(
    resume_id: int,
    format: str = "pdf",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    if format == "pdf":
        if not resume.s3_key_generated_pdf:
             raise HTTPException(status_code=404, detail="PDF not generated yet")
             
        # Check if S3
        if resume.s3_key_generated_pdf.startswith("s3://"):
             from app.core.storage import storage
             url = storage.get_file_url(resume.s3_key_generated_pdf)
             if not url:
                 raise HTTPException(status_code=500, detail="Could not generate download URL")
             from fastapi.responses import RedirectResponse
             return RedirectResponse(url=url)
             
        # Local
        if not os.path.exists(resume.s3_key_generated_pdf):
             raise HTTPException(status_code=404, detail="PDF file missing on server")
             
        return FileResponse(resume.s3_key_generated_pdf, media_type="application/pdf", filename=f"resume_{resume_id}.pdf")
    
    raise HTTPException(status_code=400, detail="Unsupported format")
