
export const PROVIDERS = [
  { id: "google", name: "Google Gemini", icon: "🔷", color: "from-blue-500 to-cyan-500" },
  { id: "openai", name: "OpenAI GPT", icon: "🟢", color: "from-green-500 to-emerald-500" },
  { id: "anthropic", name: "Anthropic Claude", icon: "🟠", color: "from-orange-500 to-amber-500" },
]

export const MODELS: Record<string, { id: string; name: string }[]> = {
  google: [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
    { id: "gemini-3-pro-preview", name: "Gemini 3 Pro (Preview)" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  ],
  openai: [
    { id: "gpt-5.1-2025-11-13", name: "GPT-5.1 (Latest)" },
    { id: "gpt-5-pro-2025-10-06", name: "GPT-5 Pro" },
    { id: "gpt-5-mini-2025-08-07", name: "GPT-5 Mini" },
    { id: "gpt-5-nano-2025-08-07", name: "GPT-5 Nano" },
    { id: "gpt-5-2025-08-07", name: "GPT-5" },
    { id: "gpt-4.1-2025-04-14", name: "GPT-4.1" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  ],
  anthropic: [
    { id: "claude-sonnet-4-5", name: "Claude 4.5 Sonnet" },
    { id: "claude-haiku-4-5", name: "Claude 4.5 Haiku" },
    { id: "claude-opus-4-5", name: "Claude 4.5 Opus" },
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
    { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
  ],
}

export const API_LINKS: Record<string, string> = {
  google: "https://makersuite.google.com/app/apikey",
  openai: "https://platform.openai.com/api-keys",
  anthropic: "https://console.anthropic.com/settings/keys",
}
