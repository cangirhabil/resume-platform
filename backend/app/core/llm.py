from typing import Any, List, Optional, Dict
import os
import json
from openai import OpenAI
from anthropic import Anthropic
import google.generativeai as genai

class LLMService:
    def __init__(self, provider: str = "google"):
        self.provider = provider
        self.openai_client = None
        self.anthropic_client = None
        self.google_model = None

        if self.provider == "openai":
            self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        elif self.provider == "anthropic":
            self.anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        elif self.provider == "google":
            genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
            self.google_model = genai.GenerativeModel('gemini-1.5-pro')

    async def generate_json(self, prompt: str, system_prompt: str = "") -> Dict[str, Any]:
        """
        Generates a JSON response from the LLM.
        """
        try:
            if self.provider == "openai":
                response = self.openai_client.chat.completions.create(
                    model="gpt-4-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"}
                )
                return json.loads(response.choices[0].message.content)

            elif self.provider == "anthropic":
                # Anthropic doesn't strictly enforce JSON object mode like OpenAI yet in all SDKs, 
                # but we can prompt for it.
                message = self.anthropic_client.messages.create(
                    model="claude-3-opus-20240229",
                    max_tokens=4096,
                    system=system_prompt + " You must output valid JSON.",
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                # Naive JSON extraction (assuming Claude behaves)
                content = message.content[0].text
                start = content.find('{')
                end = content.rfind('}') + 1
                return json.loads(content[start:end])

            elif self.provider == "google":
                # Gemini 1.5 Pro json mode
                full_prompt = f"{system_prompt}\n\n{prompt}"
                response = self.google_model.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        response_mime_type="application/json"
                    )
                )
                return json.loads(response.text)
                
        except Exception as e:
            print(f"LLM Generation Error: {e}")
            return {"error": str(e)}

    async def generate_text(self, prompt: str, system_prompt: str = "") -> str:
        try:
            if self.provider == "openai":
                response = self.openai_client.chat.completions.create(
                    model="gpt-4-turbo",
                    messages=[
                         {"role": "system", "content": system_prompt},
                         {"role": "user", "content": prompt}
                    ]
                )
                return response.choices[0].message.content

            elif self.provider == "anthropic":
                 message = self.anthropic_client.messages.create(
                    model="claude-3-opus-20240229",
                    max_tokens=4096,
                    system=system_prompt,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                 return message.content[0].text
            
            elif self.provider == "google":
                 full_prompt = f"{system_prompt}\n\n{prompt}"
                 response = self.google_model.generate_content(full_prompt)
                 return response.text

        except Exception as e:
             return f"Error generating text: {e}"

# Default instance (can be swapped)
llm = LLMService(provider=os.getenv("LLM_PROVIDER", "google"))
