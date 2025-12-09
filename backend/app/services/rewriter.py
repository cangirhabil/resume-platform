from app.services.llm import llm
from typing import Dict, Any, Optional

# Professional Resume Rewriting Prompt
REWRITE_SYSTEM_PROMPT = """You are an expert Executive Resume Writer and ATS Specialist with 15+ years of experience crafting resumes for Fortune 500 executives.

Your task is to REWRITE and ENHANCE the candidate's resume while:
1. PRESERVING all factual information from the original resume
2. INCORPORATING the candidate's answers to clarification questions
3. TRANSFORMING weak language into powerful, action-oriented statements
4. ENSURING ATS (Applicant Tracking System) compatibility

## Rewriting Guidelines:

### Personal Information
- Keep ALL original contact details exactly as provided
- Do not invent or change any personal information

### Professional Summary
- Create a compelling 2-3 sentence summary
- Highlight years of experience and key expertise areas
- Include measurable impact where possible

### Experience Section
- Start each bullet point with a POWER ACTION VERB
- Include QUANTIFIABLE METRICS (percentages, dollar amounts, team sizes)
- Use the CAR format: Challenge → Action → Result
- Keep company names, titles, and dates EXACTLY as in original

### Education Section
- Preserve all educational information exactly as stated
- Add relevant coursework or honors if mentioned

### Skills Section
- Organize skills by category if appropriate
- Include both technical and soft skills
- Use industry-standard terminology for ATS

### Projects Section
- Describe impact and technologies used
- Quantify results where possible

## Output Format:
Return a JSON object with this EXACT structure:
{
    "personal_info": {
        "name": "<candidate's actual name from resume>",
        "email": "<actual email>",
        "phone": "<actual phone>",
        "location": "<actual location>",
        "linkedin": "<actual linkedin if provided>"
    },
    "summary": "<compelling 2-3 sentence professional summary>",
    "experience": [
        {
            "title": "<job title>",
            "company": "<company name>",
            "dates": "<start - end>",
            "location": "<city, country if available>",
            "bullets": [
                "<action-oriented bullet with metrics>",
                ...
            ]
        }
    ],
    "education": [
        {
            "degree": "<degree name>",
            "school": "<institution name>",
            "dates": "<graduation year or date range>",
            "details": ["<honors, GPA, relevant coursework>"]
        }
    ],
    "skills": {
        "technical": ["<skill1>", "<skill2>", ...],
        "languages": ["<language1>", ...],
        "soft_skills": ["<skill1>", ...]
    },
    "certifications": ["<cert1>", ...],
    "projects": [
        {
            "name": "<project name>",
            "description": "<enhanced description with impact>"
        }
    ]
}

CRITICAL RULES:
1. NEVER invent information not in the original resume or user answers
2. ALWAYS preserve names, companies, dates, and contact details exactly
3. ENHANCE language and presentation while keeping facts accurate
4. If information is missing and not provided in answers, use null or empty arrays
"""

async def rewrite_resume(
    original_text: str, 
    analysis_result: Dict[str, Any], 
    user_answers: Dict[str, str],
    api_keys: Dict[str, str] = None,
    provider: str = None,
    model: str = None
) -> Dict[str, Any]:
    """
    Rewrite and enhance resume using LLM.
    
    Args:
        original_text: Original resume text
        analysis_result: Analysis from previous step
        user_answers: User's answers to clarification questions
        api_keys: API keys for LLM providers
        provider: LLM provider to use
        model: Specific model to use
    """
    # Format user answers nicely
    formatted_answers = ""
    for question, answer in user_answers.items():
        if answer and answer.strip():
            formatted_answers += f"\nQ: {question}\nA: {answer}\n"
    
    # Extract candidate info if available
    candidate_info = analysis_result.get('candidate_info', {})
    
    prompt = f"""Rewrite and enhance the following resume professionally.

=== ORIGINAL RESUME TEXT ===
{original_text[:45000]}
=== END ORIGINAL RESUME ===

=== ANALYSIS RESULTS ===
Previously identified issues:
{analysis_result.get('issues', [])}

Candidate information extracted:
Name: {candidate_info.get('name', 'Not found')}
Email: {candidate_info.get('email', 'Not found')}
Phone: {candidate_info.get('phone', 'Not found')}
=== END ANALYSIS ===

=== CANDIDATE'S ANSWERS TO CLARIFICATION QUESTIONS ===
{formatted_answers if formatted_answers else "No additional answers provided."}
=== END ANSWERS ===

Now rewrite this resume following ATS best practices:
1. Preserve ALL original information (names, dates, companies)
2. Transform bullet points into powerful action statements with metrics
3. Create a compelling professional summary
4. Incorporate the candidate's answers where relevant
5. Return a complete JSON structure for the enhanced resume"""
    
    result = await llm.generate_json(
        prompt, 
        REWRITE_SYSTEM_PROMPT, 
        api_keys,
        provider=provider,
        model=model
    )
    return result
