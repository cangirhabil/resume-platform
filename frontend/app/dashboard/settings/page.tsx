"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Save, Check } from "lucide-react"

import { SettingsHeader } from "./components/SettingsHeader"
import { ProviderSelector } from "./components/ProviderSelector"
import { ModelSelector } from "./components/ModelSelector"
import { ApiKeyInput } from "./components/ApiKeyInput"
import { MODELS, PROVIDERS } from "./components/constants"

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
      <SettingsHeader />
      
      <ProviderSelector 
        selectedProvider={provider} 
        onSelect={setProvider} 
      />
      
      <ModelSelector 
        provider={provider} 
        selectedModel={model} 
        onSelect={setModel} 
      />
      
      <ApiKeyInput 
        provider={provider} 
        apiKey={apiKey} 
        onChange={setApiKey} 
      />

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
