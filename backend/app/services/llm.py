import os
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "google")
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        
    async def generate_json(self, prompt: str, system_prompt: str, api_keys: Dict[str, str] = None) -> Dict[str, Any]:
        # 1. Resolve Keys (Request Header > Env Var)
        req_openai = api_keys.get("openai") if api_keys else None
        req_google = api_keys.get("google") if api_keys else None
        
        final_openai_key = req_openai or self.openai_api_key
        final_google_key = req_google or self.google_api_key
        
        # 2. Determine Provider
        active_provider = self.provider
        active_key = None
        
        if final_google_key:
            active_provider = "google"
            active_key = final_google_key
        elif final_openai_key:
            active_provider = "openai"
            active_key = final_openai_key
            
        logger.info(f"Generating JSON with provider: {active_provider} (Key Provided: {bool(active_key)})")
        
        # 3. Fallback to Mock if no keys
        if not active_key:
            logger.warning("No API keys found. Returning MOCK data.")
            return self._get_mock_response(system_prompt)

        # 4. REAL CALLS (IMPLEMENTATION START)
        try:
            if active_provider == "google":
                import google.generativeai as genai
                genai.configure(api_key=active_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(
                    f"{system_prompt}\n\n{prompt}",
                    generation_config={"response_mime_type": "application/json"}
                )
                return json.loads(response.text)
                
            elif active_provider == "openai":
                from openai import OpenAI
                client = OpenAI(api_key=active_key)
                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"}
                )
                return json.loads(response.choices[0].message.content)
                
        except Exception as e:
            logger.error(f"LLM Call Failed: {e}")
            # Fallback to mock on error to prevent crash during demo
            return self._get_mock_response(system_prompt)
            
        return self._get_mock_response(system_prompt)

    def _get_mock_response(self, system_prompt: str) -> Dict[str, Any]:
        if "analyze" in system_prompt.lower() or "analysis" in system_prompt.lower():
            return {
                "score": 72,
                "summary": "The resume is a solid draft but lacks specific quantifiable achievements. The layout is clean.",
                "issues": [
                    "Missing quantifiable results in 'Experience' section.",
                    "Summary is too generic.",
                    "Weak action verbs used (e.g., 'Responsible for')."
                ],
                "clarification_questions": [
                    "Can you provide a specific metric for the sales increase at Company X?",
                    "What was the size of the team you managed?",
                    "Did you lead the migration project? If so, what was the outcome?"
                ]
            }
        elif "rewrite" in system_prompt.lower():
             return {
                "personal_info": {
                    "name": "Jane Doe",
                    "email": "jane@example.com",
                    "phone": "555-0102",
                    "linkedin": "linkedin.com/in/janedoe",
                    "location": "San Francisco, CA"
                },
                "summary": "Results-driven Software Engineer with 5+ years of experience in full-stack development. Proven track record of improving system performance by 30% and leading cross-functional teams.",
                "experience": [
                    {
                        "title": "Senior Software Engineer",
                        "company": "Tech Solutions Inc.",
                        "dates": "2020 - Present",
                        "description": "Led a team of 5 developers to build a scalable microservices architecture. Reduced latency by 40%."
                    },
                    {
                        "title": "Software Engineer",
                        "company": "Startup Hub",
                        "dates": "2018 - 2020",
                        "description": "Developed and maintained user-facing features using React and Node.js."
                    }
                ],
                "education": [
                    {
                        "degree": "B.S. Computer Science",
                        "school": "University of Tech",
                        "dates": "2014 - 2018"
                    }
                ],
                "skills": ["Python", "JavaScript", "React", "AWS", "SQL", "FastAPI"],
                "projects": [
                    {
                        "name": "Resume AI",
                        "description": "Built an AI-powered resume builder using Python and Next.js."
                    }
                ]
            }
        else:
            return {"message": "Mock response"}

llm = LLMService()
