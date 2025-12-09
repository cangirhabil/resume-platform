from app.services.llm import llm
from typing import Dict, Any

ANALYSIS_SYSTEM_PROMPT = """
You are an expert Executive Resume Writer and Career Coach. 
Your goal is to analyze resumes and identify:
1. Missing critical information (Gaps).
2. Weak action verbs or passive language.
3. Lack of quantifiable results.
4. Formatting or structural issues.

You must output a structured JSON containing a score (0-100), a list of 'issues', and a list of 'clarification_questions'.
The 'clarification_questions' should be specific questions to ask the candidate to gather missing info.
"""

async def analyze_resume_text(text: str, api_keys: Dict[str, str] = None) -> Dict[str, Any]:
    prompt = f"""
    Analyze the following resume text:
    
    {text[:50000]} 

    Return a JSON with keys: 'score', 'summary', 'issues' (list of strings), 'clarification_questions' (list of strings).
    """
    
    result = await llm.generate_json(prompt, ANALYSIS_SYSTEM_PROMPT, api_keys)
    return result
