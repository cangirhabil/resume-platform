import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Available models per provider
AVAILABLE_MODELS = {
    "google": [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-3-pro-preview",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
    ],
    "openai": [
        "gpt-5.1-2025-11-13",
        "gpt-5-pro-2025-10-06",
        "gpt-5-mini-2025-08-07",
        "gpt-5-nano-2025-08-07",
        "gpt-5-2025-08-07",
        "gpt-4.1-2025-04-14",
        "gpt-4o",
        "gpt-4o-mini",
    ],
    "anthropic": [
        "claude-sonnet-4-5",
        "claude-haiku-4-5",
        "claude-opus-4-5",
        "claude-3-5-sonnet-20241022",
        "claude-3-haiku-20240307",
    ],
}

class LLMService:
    def __init__(self):
        self.default_provider = os.getenv("LLM_PROVIDER", "google")
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
    
    def get_available_models(self) -> Dict[str, list]:
        """Returns available models per provider."""
        return AVAILABLE_MODELS
        
    async def generate_json(
        self, 
        prompt: str, 
        system_prompt: str, 
        api_keys: Dict[str, str] = None,
        provider: str = None,
        model: str = None
    ) -> Dict[str, Any]:
        """
        Generate JSON response from LLM.
        
        Args:
            prompt: User prompt with CV content
            system_prompt: System instructions
            api_keys: Dict with provider keys (openai, google, anthropic)
            provider: Specific provider to use (google, openai, anthropic)
            model: Specific model name to use
        """
        # 1. Resolve API Keys (Request > Environment)
        req_openai = api_keys.get("openai") if api_keys else None
        req_google = api_keys.get("google") if api_keys else None
        req_anthropic = api_keys.get("anthropic") if api_keys else None
        
        final_openai_key = req_openai or self.openai_api_key
        final_google_key = req_google or self.google_api_key
        final_anthropic_key = req_anthropic or self.anthropic_api_key
        
        # 2. Determine Provider and Key
        active_provider = provider or self.default_provider
        active_key = None
        active_model = model
        
        # Auto-select provider based on available keys if not specified
        if not provider:
            if final_google_key:
                active_provider = "google"
                active_key = final_google_key
            elif final_openai_key:
                active_provider = "openai"
                active_key = final_openai_key
            elif final_anthropic_key:
                active_provider = "anthropic"
                active_key = final_anthropic_key
        else:
            # Use specified provider
            if active_provider == "google":
                active_key = final_google_key
            elif active_provider == "openai":
                active_key = final_openai_key
            elif active_provider == "anthropic":
                active_key = final_anthropic_key
        
        # Default models if not specified
        if not active_model:
            if active_provider == "google":
                active_model = "gemini-2.5-flash"
            elif active_provider == "openai":
                active_model = "gpt-5.1-2025-11-13"
            elif active_provider == "anthropic":
                active_model = "claude-sonnet-4-5"
                
        logger.info(f"LLM Request: provider={active_provider}, model={active_model}, has_key={bool(active_key)}")
        
        # 3. Check for API key
        if not active_key:
            raise ValueError(f"No API key provided for {active_provider}. Please add your API key in Settings.")
        
        # 4. Make LLM Call
        try:
            if active_provider == "google":
                return await self._call_google(prompt, system_prompt, active_key, active_model)
            elif active_provider == "openai":
                return await self._call_openai(prompt, system_prompt, active_key, active_model)
            elif active_provider == "anthropic":
                return await self._call_anthropic(prompt, system_prompt, active_key, active_model)
            else:
                raise ValueError(f"Unknown provider: {active_provider}")
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {e}")
            raise ValueError("LLM returned invalid JSON. Please try again.")
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            raise
    
    async def _call_google(self, prompt: str, system_prompt: str, api_key: str, model: str) -> Dict[str, Any]:
        """Call Google Gemini API."""
        import google.generativeai as genai
        
        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel(model)
        
        full_prompt = f"{system_prompt}\n\n{prompt}"
        
        response = gemini_model.generate_content(
            full_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        return json.loads(response.text)
    
    async def _call_openai(self, prompt: str, system_prompt: str, api_key: str, model: str) -> Dict[str, Any]:
        """Call OpenAI API."""
        from openai import OpenAI
        
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    async def _call_anthropic(self, prompt: str, system_prompt: str, api_key: str, model: str) -> Dict[str, Any]:
        """Call Anthropic Claude API."""
        import anthropic
        
        client = anthropic.Anthropic(api_key=api_key)
        
        # Claude requires JSON instruction in user prompt
        json_prompt = f"{prompt}\n\nIMPORTANT: Respond ONLY with valid JSON, no other text."
        
        response = client.messages.create(
            model=model,
            max_tokens=8192,
            system=system_prompt,
            messages=[
                {"role": "user", "content": json_prompt}
            ]
        )
        
        # Extract text from response
        text = response.content[0].text
        
        # Try to extract JSON if wrapped in markdown
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        return json.loads(text)

llm = LLMService()
