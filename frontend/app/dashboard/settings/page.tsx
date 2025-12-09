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
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Fast)", recommended: true },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Advanced)" },
    { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Experimental)" },
  ],
  openai: [
    { id: "gpt-4o", name: "GPT-4o (Recommended)", recommended: true },
    { id: "gpt-4o-mini", name: "GPT-4o Mini (Faster)" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  ],
  anthropic: [
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Best)", recommended: true },
    { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku (Fast)" },
  ],
}

export default function SettingsPage() {
  const [provider, setProvider] = useState("google")
  const [model, setModel] = useState("gemini-1.5-flash")
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
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Settings
        </h2>
        <p className="text-zinc-400">Configure your AI model and API keys for resume processing.</p>
      </div>

      {/* AI Model Selection */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-400" />
            AI Model Selection
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Choose which AI model to use for analyzing and rewriting your resumes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label className="text-zinc-200">AI Provider</Label>
            <div className="grid grid-cols-3 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    provider === p.id 
                      ? "border-indigo-500 bg-indigo-500/20 text-white" 
                      : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
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
            <Label className="text-zinc-200">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {MODELS[provider as keyof typeof MODELS]?.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-white hover:bg-zinc-700">
                    <div className="flex items-center gap-2">
                      {m.name}
                      {m.recommended && (
                        <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded">
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
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-400" />
            API Keys
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your API key for the selected provider. Keys are stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Gemini Key */}
          <div className={`space-y-2 p-3 rounded-lg transition-all ${provider === "google" ? "bg-indigo-500/10 border border-indigo-500/30" : ""}`}>
            <div className="flex items-center justify-between">
              <Label htmlFor="gemini" className="text-zinc-200">
                🔷 Google Gemini API Key
              </Label>
              {provider === "google" && (
                <span className="text-xs text-indigo-400 flex items-center gap-1">
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
              className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500"
            />
            <p className="text-xs text-zinc-500">
              Get your key at <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-indigo-400 hover:underline">Google AI Studio</a>
            </p>
          </div>
          
          {/* OpenAI Key */}
          <div className={`space-y-2 p-3 rounded-lg transition-all ${provider === "openai" ? "bg-indigo-500/10 border border-indigo-500/30" : ""}`}>
            <div className="flex items-center justify-between">
              <Label htmlFor="openai" className="text-zinc-200">
                🟢 OpenAI API Key
              </Label>
              {provider === "openai" && (
                <span className="text-xs text-indigo-400 flex items-center gap-1">
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
              className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500"
            />
            <p className="text-xs text-zinc-500">
              Get your key at <a href="https://platform.openai.com/api-keys" target="_blank" className="text-indigo-400 hover:underline">OpenAI Platform</a>
            </p>
          </div>

          {/* Anthropic Key */}
          <div className={`space-y-2 p-3 rounded-lg transition-all ${provider === "anthropic" ? "bg-indigo-500/10 border border-indigo-500/30" : ""}`}>
            <div className="flex items-center justify-between">
              <Label htmlFor="anthropic" className="text-zinc-200">
                🟠 Anthropic API Key
              </Label>
              {provider === "anthropic" && (
                <span className="text-xs text-indigo-400 flex items-center gap-1">
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
              className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500"
            />
            <p className="text-xs text-zinc-500">
              Get your key at <a href="https://console.anthropic.com/settings/keys" target="_blank" className="text-indigo-400 hover:underline">Anthropic Console</a>
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
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white`}
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>

      {/* Current Config Summary */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Current Configuration:</span>
            <span className="text-white font-medium">
              {PROVIDERS.find(p => p.id === provider)?.icon} {MODELS[provider as keyof typeof MODELS]?.find(m => m.id === model)?.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
