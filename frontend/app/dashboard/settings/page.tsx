"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Save, Zap, Key, Bot, Check, ArrowLeft, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"

const PROVIDERS = [
  { id: "google", name: "Google Gemini", icon: "🔷", color: "from-blue-500 to-cyan-500" },
  { id: "openai", name: "OpenAI GPT", icon: "🟢", color: "from-green-500 to-emerald-500" },
  { id: "anthropic", name: "Anthropic Claude", icon: "🟠", color: "from-orange-500 to-amber-500" },
]

const MODELS: Record<string, { id: string; name: string }[]> = {
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

const API_LINKS: Record<string, string> = {
  google: "https://makersuite.google.com/app/apikey",
  openai: "https://platform.openai.com/api-keys",
  anthropic: "https://console.anthropic.com/settings/keys",
}

export default function SettingsPage() {
  const [provider, setProvider] = useState("google")
  const [model, setModel] = useState("gemini-2.5-flash")
  const [apiKey, setApiKey] = useState("")
  const [saved, setSaved] = useState(false)

  // Load saved settings
  useEffect(() => {
    const savedProvider = localStorage.getItem("llm_provider") || "google"
    const savedModel = localStorage.getItem("llm_model") || "gemini-2.5-flash"
    setProvider(savedProvider)
    setModel(savedModel)
    loadApiKey(savedProvider)
  }, [])

  // Load API key for selected provider
  function loadApiKey(prov: string) {
    const keyName = prov === "google" ? "google_api_key" : 
                    prov === "openai" ? "openai_api_key" : "anthropic_api_key"
    setApiKey(localStorage.getItem(keyName) || "")
  }

  // Update model when provider changes
  useEffect(() => {
    const providerModels = MODELS[provider]
    if (providerModels && !providerModels.find(m => m.id === model)) {
      setModel(providerModels[0].id)
    }
    loadApiKey(provider)
  }, [provider])

  const handleSave = () => {
    localStorage.setItem("llm_provider", provider)
    localStorage.setItem("llm_model", model)
    
    const keyName = provider === "google" ? "google_api_key" : 
                    provider === "openai" ? "openai_api_key" : "anthropic_api_key"
    localStorage.setItem(keyName, apiKey)
    
    setSaved(true)
    toast.success("Settings saved!")
    setTimeout(() => setSaved(false), 2000)
  }

  const currentProvider = PROVIDERS.find(p => p.id === provider)

  return (
    <div className="max-w-10xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resumes
        </Link>
        <h1 className="font-barlow text-4xl font-bold uppercase tracking-tight text-[var(--foreground)]">
          Settings
        </h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Configure your AI model for resume analysis
        </p>
      </motion.div>

      {/* Step 1: Select Provider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-fab-red text-white text-xs font-bold flex items-center justify-center">1</div>
          <span className="font-medium text-[var(--foreground)]">Select AI Provider</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                provider === p.id 
                  ? "border-fab-red bg-fab-red/5" 
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]"
              }`}
            >
              <span className="text-3xl block mb-2">{p.icon}</span>
              <span className={`text-sm font-medium ${provider === p.id ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
                {p.name.split(" ")[0]}
              </span>
              {provider === p.id && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-fab-red rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Step 2: Select Model */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-fab-red text-white text-xs font-bold flex items-center justify-center">2</div>
          <span className="font-medium text-[var(--foreground)]">Select Model</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {MODELS[provider]?.map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`p-3 rounded-lg border text-sm transition-all ${
                model === m.id 
                  ? "border-fab-red bg-fab-red/5 text-[var(--foreground)]" 
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Step 3: Enter API Key */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-fab-red text-white text-xs font-bold flex items-center justify-center">3</div>
          <span className="font-medium text-[var(--foreground)]">Enter API Key</span>
        </div>
        
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-[var(--foreground)] flex items-center gap-2">
              {currentProvider?.icon} {currentProvider?.name} API Key
            </Label>
            <a 
              href={API_LINKS[provider]} 
              target="_blank"
              className="text-xs text-fab-red hover:underline flex items-center gap-1"
            >
              Get API Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <Input 
            type="password" 
            placeholder={provider === "google" ? "AIza..." : "sk-..."}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] text-lg tracking-wider"
          />
          {!apiKey && (
            <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
              ⚠️ API key required to analyze resumes
            </p>
          )}
          {apiKey && (
            <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
              ✓ API key configured
            </p>
          )}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Button 
          onClick={handleSave}
          className={`w-full py-6 font-barlow font-bold uppercase tracking-wider text-lg transition-all ${
            saved 
              ? "bg-emerald-500 hover:bg-emerald-600" 
              : "bg-fab-red hover:bg-fab-red/90"
          } text-white`}
        >
          {saved ? <Check className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </motion.div>

      {/* Current Config Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 rounded-xl bg-[var(--surface)] text-center"
      >
        <p className="text-sm text-[var(--muted-foreground)]">
          Active Configuration: <span className="text-[var(--foreground)] font-medium ml-1">
            {currentProvider?.icon} {MODELS[provider]?.find(m => m.id === model)?.name}
          </span>
        </p>
      </motion.div>
    </div>
  )
}
