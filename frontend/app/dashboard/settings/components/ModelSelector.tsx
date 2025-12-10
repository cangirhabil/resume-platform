
import { motion } from "framer-motion"
import { MODELS } from "./constants"

interface ModelSelectorProps {
  provider: string
  selectedModel: string
  onSelect: (modelId: string) => void
}

export function ModelSelector({ provider, selectedModel, onSelect }: ModelSelectorProps) {
  return (
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
            onClick={() => onSelect(m.id)}
            className={`p-3 rounded-lg border text-sm transition-all ${
              selectedModel === m.id 
                ? "border-fab-red bg-fab-red/5 text-[var(--foreground)]" 
                : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
