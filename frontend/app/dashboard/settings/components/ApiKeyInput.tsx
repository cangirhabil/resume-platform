
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PROVIDERS, API_LINKS } from "./constants"

interface ApiKeyInputProps {
  provider: string
  apiKey: string
  onChange: (key: string) => void
}

export function ApiKeyInput({ provider, apiKey, onChange }: ApiKeyInputProps) {
  const currentProvider = PROVIDERS.find(p => p.id === provider)

  return (
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
            rel="noopener noreferrer"
            className="text-xs text-fab-red hover:underline flex items-center gap-1"
          >
            Get API Key <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <Input 
          type="password" 
          placeholder={provider === "google" ? "AIza..." : "sk-..."}
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
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
  )
}
