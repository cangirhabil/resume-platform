import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.api.v1.endpoints.analysis import process_analysis
from app.models import Resume

async def main():
    db = SessionLocal()
    try:
        resume = db.query(Resume).first()
        if resume:
            print(f"Testing analysis for resume {resume.id}")
            # Mock S3 extractor to avoid S3 download if possible, or just let it fail
            # We want to see if arguments are passed correctly to analyze_resume_text
            
            await process_analysis(
                resume.id, 
                # db argument removed
                api_keys={'openai': 'sk-dummy'}, 
                provider='openai', 
                model='gpt-3.5-turbo',
                job_posting="Software Engineer",
                template="traditional"
            )
            print("Process completed (check logs for specific LLM errors)")
        else:
            print("No resume found in DB")
    except Exception as e:
        print(f"Script caught exception: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(main())
