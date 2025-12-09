"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [openaiKey, setOpenaiKey] = useState("")
  const [geminiKey, setGeminiKey] = useState("")

  useEffect(() => {
    // Load from localStorage on mount
    const savedOpenAI = localStorage.getItem("openai_api_key")
    const savedGemini = localStorage.getItem("google_api_key")
    if (savedOpenAI) setOpenaiKey(savedOpenAI)
    if (savedGemini) setGeminiKey(savedGemini)
  }, [])

  const handleSave = () => {
    localStorage.setItem("openai_api_key", openaiKey)
    localStorage.setItem("google_api_key", geminiKey)
    toast.success("API Keys saved successfully!")
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Settings
        </h2>
        <p className="text-zinc-400">Manage your API keys and preferences.</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">AI Model Configuration</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your own API keys to power the Resume Analysis and Rewrite engines.
            Your keys are stored locally in your browser and sent securely with each request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai" className="text-zinc-200">OpenAI API Key (GPT-4)</Label>
            <Input 
              id="openai" 
              type="password" 
              placeholder="sk-..." 
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500"
            />
            <p className="text-xs text-zinc-500">Required if you want to use OpenAI models.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gemini" className="text-zinc-200">Google Gemini API Key</Label>
            <Input 
              id="gemini" 
              type="password" 
              placeholder="AIza..." 
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500"
            />
             <p className="text-xs text-zinc-500">Required if you want to use Google Gemini models.</p>
          </div>

          <Button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 mt-4">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
