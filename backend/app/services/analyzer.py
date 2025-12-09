from app.services.llm import llm
from typing import Dict, Any, Optional

# ATS-Optimized Resume Analysis Prompt
ANALYSIS_SYSTEM_PROMPT = """You are an expert Executive Resume Writer, Career Coach, and ATS (Applicant Tracking System) Specialist with 15+ years of experience.

Your task is to analyze the candidate's resume thoroughly and provide:
1. An overall ATS compatibility score (0-100)
2. A detailed summary of the resume's strengths and weaknesses
3. Specific issues that need improvement
4. Clarification questions to gather missing information from the candidate

## Analysis Criteria:

### ATS Compatibility (40 points)
- Standard section headings (Experience, Education, Skills)
- Clean formatting without tables/graphics
- Keyword optimization for the industry
- Proper date formats

### Content Quality (30 points)
- Action verbs at the start of bullet points
- Quantifiable achievements with metrics
- Relevant skills and keywords
- Clear career progression

### Structure & Formatting (20 points)
- Logical section order
- Consistent formatting
- Appropriate length (1-2 pages)
- Contact information completeness

### Impact & Clarity (10 points)
- Strong professional summary
- Clear value proposition
- No spelling/grammar errors
- Industry-appropriate language

## Output Format:
Return a JSON object with the following structure:
{
    "score": <number 0-100>,
    "summary": "<2-3 sentence overview of the resume>",
    "candidate_info": {
        "name": "<extracted name or null>",
        "email": "<extracted email or null>",
        "phone": "<extracted phone or null>",
        "location": "<extracted location or null>",
        "linkedin": "<extracted linkedin or null>"
    },
    "strengths": ["<strength 1>", "<strength 2>", ...],
    "issues": ["<specific issue 1>", "<specific issue 2>", ...],
    "clarification_questions": [
        "<specific question based on CV gaps>",
        "<question to gather missing metrics>",
        ...
    ],
    "keywords_found": ["<relevant keyword 1>", ...],
    "keywords_missing": ["<recommended keyword 1>", ...]
}

IMPORTANT: 
- Generate 3-5 clarification questions that are SPECIFIC to THIS candidate's resume
- Questions should help fill gaps in their experience (missing metrics, unclear achievements, etc.)
- Extract actual information from the resume, don't make up data
"""

async def analyze_resume_text(
    text: str, 
    api_keys: Dict[str, str] = None,
    provider: str = None,
    model: str = None
) -> Dict[str, Any]:
    """
    Analyze resume text using LLM.
    
    Args:
        text: Extracted text from the resume
        api_keys: API keys for LLM providers
        provider: LLM provider to use
        model: Specific model to use
    """
    prompt = f"""Analyze the following resume text carefully. Extract all relevant information and identify areas for improvement.

=== RESUME TEXT START ===
{text[:50000]}
=== RESUME TEXT END ===

Based on this resume:
1. Extract the candidate's personal information
2. Score the resume on ATS compatibility and content quality
3. Identify specific strengths and issues
4. Generate 3-5 clarification questions that will help improve THIS specific resume

Return your analysis as a JSON object following the specified format."""
    
    result = await llm.generate_json(
        prompt, 
        ANALYSIS_SYSTEM_PROMPT, 
        api_keys,
        provider=provider,
        model=model
    )
    return result
