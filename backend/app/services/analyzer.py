from app.services.llm import llm
from typing import Dict, Any, Optional

# Smart Resume Analyzer System Prompt
ANALYSIS_SYSTEM_PROMPT = """You are an expert Executive Resume Writer, Career Coach, and ATS Specialist with 15+ years of experience.

Your task is to analyze the candidate's resume and generate SMART, CONTEXTUAL questions based on:
1. Gaps or unclear information in the resume
2. The target job posting (if provided)
3. Template requirements for a professional resume

## QUESTION GENERATION RULES:

**ONLY ask questions if information is genuinely missing or unclear:**

1. **Skip questions if the resume already has:**
   - Clear name, email, phone, location
   - Well-defined job titles and companies
   - Quantified achievements with metrics
   - Graduation dates for education
   - Relevant skills list

2. **ASK questions for:**
   - Missing metrics (e.g., "How many users?" if not mentioned)
   - Unclear date ranges (e.g., "What's the end date for X role?")
   - Job posting alignment gaps (skills they have but didn't highlight)
   - Missing achievements that match the target job

3. **If a job posting is provided:**
   - Focus questions on how candidate's experience matches the job requirements
   - Ask about relevant skills/achievements not clearly shown
   - Don't ask generic questions - be specific to the job

4. **NUMBER OF QUESTIONS:**
   - Ask 0 questions if everything is clear
   - Ask 1-2 questions if minor gaps exist
   - Ask 3-4 questions only if significant information is missing
   - NEVER ask more than 4 questions
   - NEVER ask "filler" questions that don't add value

## Output Format:
Return a JSON object:
{
    "score": <number 0-100>,
    "summary": "<2-3 sentence overview>",
    "candidate_info": {
        "name": "<extracted or null>",
        "email": "<extracted or null>",
        "phone": "<extracted or null>",
        "location": "<extracted or null>",
        "linkedin": "<extracted or null>"
    },
    "strengths": ["<strength 1>", ...],
    "issues": ["<issue 1>", ...],
    "clarification_questions": [
        "<ONLY questions for truly missing information>"
    ],
    "keywords_found": ["<keyword>", ...],
    "keywords_missing": ["<suggested keyword>", ...],
    "job_match_analysis": "<if job posting provided, explain how well they match>"
}

CRITICAL: 
- Only include questions that will ACTUALLY IMPROVE the resume
- If resume is complete, return an EMPTY clarification_questions array []
- Questions must be specific, not generic
"""

async def analyze_resume_text(
    text: str, 
    api_keys: Dict[str, str] = None,
    provider: str = None,
    model: str = None,
    job_posting: str = None,
    template: str = "professional"
) -> Dict[str, Any]:
    """
    Analyze resume text using LLM with context from job posting and template.
    """
    
    # Build context-aware prompt
    job_context = ""
    if job_posting and len(job_posting.strip()) > 20:
        job_context = f"""

=== TARGET JOB POSTING ===
{job_posting[:5000]}
=== END JOB POSTING ===

IMPORTANT: The candidate wants to apply to this specific job. 
- Analyze how well their resume matches this job
- Focus questions on gaps between their experience and job requirements
- If they already have the required skills/experience, don't ask about it
"""

    template_context = f"""

=== TEMPLATE TYPE ===
The user selected the "{template}" template which requires:
- Clear section headings (Experience, Education, Skills)
- Quantified achievements
- Contact information
- Professional summary

Only ask about information needed for this template that is MISSING from the resume.
"""

    prompt = f"""Analyze this resume and determine what (if any) clarification is needed.

=== RESUME TEXT ===
{text[:50000]}
=== END RESUME ===
{job_context}{template_context}

INSTRUCTIONS:
1. Extract candidate's personal info
2. Score the resume (0-100)
3. Identify strengths and issues
4. ONLY generate questions for truly MISSING or UNCLEAR information
5. If the resume is complete, return empty clarification_questions array

Remember: 
- Less is more - don't ask unnecessary questions
- Be specific to THIS candidate's resume
- If job posting is provided, focus on job-resume gaps"""

    result = await llm.generate_json(
        prompt, 
        ANALYSIS_SYSTEM_PROMPT, 
        api_keys,
        provider=provider,
        model=model
    )
    return result

