"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Save, Zap, Key, Bot, Check } from "lucide-react"

const PROVIDERS = [
  { id: "google", name: "Google Gemini", icon: "🔷" },
  { id: "openai", name: "OpenAI GPT", icon: "🟢" },
  { id: "anthropic", name: "Anthropic Claude", icon: "🟠" },
]

const MODELS = {
  google: [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", recommended: true },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite (Fast)" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Advanced)" },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
    { id: "gemini-3-pro-preview", name: "Gemini 3 Pro (Preview)" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  ],
  openai: [
    { id: "gpt-5.1-2025-11-13", name: "GPT-5.1 (Latest)", recommended: true },
    { id: "gpt-5-pro-2025-10-06", name: "GPT-5 Pro (Advanced)" },
    { id: "gpt-5-mini-2025-08-07", name: "GPT-5 Mini (Fast)" },
    { id: "gpt-5-nano-2025-08-07", name: "GPT-5 Nano (Fastest)" },
    { id: "gpt-5-2025-08-07", name: "GPT-5" },
    { id: "gpt-4.1-2025-04-14", name: "GPT-4.1" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  ],
  anthropic: [
    { id: "claude-sonnet-4-5", name: "Claude 4.5 Sonnet", recommended: true },
    { id: "claude-haiku-4-5", name: "Claude 4.5 Haiku (Fast)" },
    { id: "claude-opus-4-5", name: "Claude 4.5 Opus (Best)" },
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
    { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
  ],
}

export default function SettingsPage() {
  const [provider, setProvider] = useState("google")
  const [model, setModel] = useState("gemini-2.5-flash")
  const [openaiKey, setOpenaiKey] = useState("")
  const [geminiKey, setGeminiKey] = useState("")
  const [anthropicKey, setAnthropicKey] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const savedProvider = localStorage.getItem("llm_provider")
    const savedModel = localStorage.getItem("llm_model")
    const savedOpenAI = localStorage.getItem("openai_api_key")
    const savedGemini = localStorage.getItem("google_api_key")
    const savedAnthropic = localStorage.getItem("anthropic_api_key")
    
    if (savedProvider) setProvider(savedProvider)
    if (savedModel) setModel(savedModel)
    if (savedOpenAI) setOpenaiKey(savedOpenAI)
    if (savedGemini) setGeminiKey(savedGemini)
    if (savedAnthropic) setAnthropicKey(savedAnthropic)
  }, [])

  // Reset model when provider changes
  useEffect(() => {
    const providerModels = MODELS[provider as keyof typeof MODELS]
    if (providerModels && !providerModels.find(m => m.id === model)) {
      const defaultModel = providerModels.find(m => m.recommended) || providerModels[0]
      setModel(defaultModel.id)
    }
  }, [provider])

  const handleSave = () => {
    localStorage.setItem("llm_provider", provider)
    localStorage.setItem("llm_model", model)
    localStorage.setItem("openai_api_key", openaiKey)
    localStorage.setItem("google_api_key", geminiKey)
    localStorage.setItem("anthropic_api_key", anthropicKey)
    
    setSaved(true)
    toast.success("Settings saved successfully!")
    setTimeout(() => setSaved(false), 2000)
  }

  const getActiveKey = () => {
    if (provider === "google") return geminiKey
    if (provider === "openai") return openaiKey
    if (provider === "anthropic") return anthropicKey
    return ""
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-fab-red to-fab-blue bg-clip-text text-transparent">
          Settings
        </h2>
        <p className="text-[var(--muted-foreground)]">Configure your AI model and API keys for resume processing.</p>
      </div>

      {/* AI Model Selection */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)] flex items-center gap-2">
            <Bot className="h-5 w-5 text-fab-red" />
            AI Model Selection
          </CardTitle>
          <CardDescription className="text-[var(--muted-foreground)]">
            Choose which AI model to use for analyzing and rewriting your resumes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label className="text-[var(--foreground)]">AI Provider</Label>
            <div className="grid grid-cols-3 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    provider === p.id 
                      ? "border-fab-red bg-fab-red/20 text-[var(--foreground)]" 
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-zinc-600"
                  }`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <div className="text-sm mt-1">{p.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label className="text-[var(--foreground)]">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                {MODELS[provider as keyof typeof MODELS]?.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-[var(--foreground)] hover:bg-[var(--surface-hover)]">
                    <div className="flex items-center gap-2">
                      {m.name}
                      {m.recommended && (
                        <span className="text-xs bg-fab-red/30 text-fab-red px-2 py-0.5 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)] flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-400" />
            API Keys
          </CardTitle>
          <CardDescription className="text-[var(--muted-foreground)]">
            Enter your API key for the selected provider. Keys are stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Gemini Key */}
          <div className={`space-y-2 p-3 rounded-lg transition-all ${provider === "google" ? "bg-fab-red/10 border border-fab-red/30" : ""}`}>
            <div className="flex items-center justify-between">
              <Label htmlFor="gemini" className="text-[var(--foreground)]">
                🔷 Google Gemini API Key
              </Label>
              {provider === "google" && (
                <span className="text-xs text-fab-red flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Active
                </span>
              )}
            </div>
            <Input 
              id="gemini" 
              type="password" 
              placeholder="AIza..." 
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:ring-fab-red"
            />
            <p className="text-xs text-[var(--muted-foreground)]">
              Get your key at <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-fab-red hover:underline">Google AI Studio</a>
            </p>
          </div>
          
          {/* OpenAI Key */}
          <div className={`space-y-2 p-3 rounded-lg transition-all ${provider === "openai" ? "bg-fab-red/10 border border-fab-red/30" : ""}`}>
            <div className="flex items-center justify-between">
              <Label htmlFor="openai" className="text-[var(--foreground)]">
                🟢 OpenAI API Key
              </Label>
              {provider === "openai" && (
                <span className="text-xs text-fab-red flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Active
                </span>
              )}
            </div>
            <Input 
              id="openai" 
              type="password" 
              placeholder="sk-..." 
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:ring-fab-red"
            />
            <p className="text-xs text-[var(--muted-foreground)]">
              Get your key at <a href="https://platform.openai.com/api-keys" target="_blank" className="text-fab-red hover:underline">OpenAI Platform</a>
            </p>
          </div>

          {/* Anthropic Key */}
          <div className={`space-y-2 p-3 rounded-lg transition-all ${provider === "anthropic" ? "bg-fab-red/10 border border-fab-red/30" : ""}`}>
            <div className="flex items-center justify-between">
              <Label htmlFor="anthropic" className="text-[var(--foreground)]">
                🟠 Anthropic API Key
              </Label>
              {provider === "anthropic" && (
                <span className="text-xs text-fab-red flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Active
                </span>
              )}
            </div>
            <Input 
              id="anthropic" 
              type="password" 
              placeholder="sk-ant-..." 
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:ring-fab-red"
            />
            <p className="text-xs text-[var(--muted-foreground)]">
              Get your key at <a href="https://console.anthropic.com/settings/keys" target="_blank" className="text-fab-red hover:underline">Anthropic Console</a>
            </p>
          </div>

          {/* Warning if no key for selected provider */}
          {!getActiveKey() && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-amber-400 text-sm">
                ⚠️ No API key set for {PROVIDERS.find(p => p.id === provider)?.name}. 
                Please enter your API key above to use this provider.
              </p>
            </div>
          )}

          <Button 
            onClick={handleSave} 
            className={`w-full gap-2 mt-4 transition-all ${
              saved 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-fab-red hover:bg-fab-red/90"
            } text-[var(--foreground)]`}
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>

      {/* Current Config Summary */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Current Configuration:</span>
            <span className="text-[var(--foreground)] font-medium">
              {PROVIDERS.find(p => p.id === provider)?.icon} {MODELS[provider as keyof typeof MODELS]?.find(m => m.id === model)?.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
