from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Resume, User
from app.api.v1.endpoints.upload import get_current_user
from app.core.storage import storage
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
        file_key = resume.s3_key_generated_pdf
        content_type = "application/pdf"
        extension = "pdf"
    elif format == "docx":
        file_key = resume.s3_key_generated_docx
        content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        extension = "docx"
    else:
        raise HTTPException(status_code=400, detail="Unsupported format. Use 'pdf' or 'docx'.")
    
    if not file_key:
        raise HTTPException(status_code=404, detail=f"{format.upper()} not generated yet")
    
    # Check if S3 path
    if file_key.startswith("s3://"):
        url = storage.get_file_url(file_key)
        if not url:
            raise HTTPException(status_code=500, detail="Could not generate download URL")
        return RedirectResponse(url=url)
    
    # Local file - construct full path
    if storage.local_storage_path:
        full_path = os.path.join(storage.local_storage_path, file_key)
    else:
        full_path = file_key
    
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail=f"{format.upper()} file missing on server")
    
    return FileResponse(
        full_path, 
        media_type=content_type, 
        filename=f"resume_{resume_id}.{extension}"
    )

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a resume and its associated files."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Delete files from storage (local only for now)
    if storage.local_storage_path:
        for file_key in [resume.s3_key_original, resume.s3_key_generated_pdf, resume.s3_key_generated_docx]:
            if file_key and not file_key.startswith("s3://"):
                full_path = os.path.join(storage.local_storage_path, file_key) if not os.path.isabs(file_key) else file_key
                if os.path.exists(full_path):
                    try:
                        os.remove(full_path)
                    except Exception as e:
                        print(f"Failed to delete file {full_path}: {e}")
    
    # Delete from database
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}
