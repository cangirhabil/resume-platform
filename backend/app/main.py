from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Resume Platform API",
    description="API for AI-powered resume transformation",
    version="0.1.0",
)

# CORS Configuration
origins = [
    "http://localhost:3000",  # Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .api.v1.api import api_router
from .db.session import engine, Base

# Create Parse Tables
Base.metadata.create_all(bind=engine)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Welcome to AI Resume Platform API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
