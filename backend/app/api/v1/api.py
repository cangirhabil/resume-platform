from fastapi import APIRouter
from .endpoints import auth, upload, analysis, rewrite, download, payment, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(upload.router, prefix="/resumes", tags=["resumes"])
api_router.include_router(analysis.router, prefix="/resumes", tags=["analysis"])
api_router.include_router(rewrite.router, prefix="/resumes", tags=["rewrite"])
api_router.include_router(download.router, prefix="/resumes", tags=["download"])
api_router.include_router(payment.router, prefix="/payments", tags=["payments"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
