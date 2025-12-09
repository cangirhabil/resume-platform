from app.services.llm import llm
from typing import Dict, Any

REWRITE_SYSTEM_PROMPT = """
You are an expert Executive Resume Writer.
Your goal is to rewrite the candidate's resume to be top-tier, impactful, and ATS-friendly.
You must incorporate the user's answers to the clarification questions to fill in gaps.
Output the full rewritten resume content in a structured JSON format suitable for rendering.
Structure:
{
  "personal_info": {...},
  "summary": "...",
  "experience": [{...}],
  "education": [{...}],
  "skills": ["..."],
  "projects": [{...}]
}
Ensure all descriptions are action-oriented and quantifiable.
"""

async def rewrite_resume(original_text: str, analysis_result: Dict[str, Any], user_answers: Dict[str, str]) -> Dict[str, Any]:
    prompt = f"""
    Original Resume Text:
    {original_text[:40000]}
    
    Identified Issues:
    {analysis_result.get('issues', [])}
    
    User Answers to Questions:
    {user_answers}
    
    Please rewrite the entire resume.
    """
    
    result = await llm.generate_json(prompt, REWRITE_SYSTEM_PROMPT)
    return result
