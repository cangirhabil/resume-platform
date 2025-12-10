
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { PROVIDERS } from "./constants"

interface ProviderSelectorProps {
  selectedProvider: string
  onSelect: (providerId: string) => void
}

export function ProviderSelector({ selectedProvider, onSelect }: ProviderSelectorProps) {
  return (
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
            onClick={() => onSelect(p.id)}
            className={`relative p-4 rounded-xl border-2 text-center transition-all ${
              selectedProvider === p.id 
                ? "border-fab-red bg-fab-red/5" 
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]"
            }`}
          >
            <span className="text-3xl block mb-2">{p.icon}</span>
            <span className={`text-sm font-medium ${selectedProvider === p.id ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
              {p.name.split(" ")[0]}
            </span>
            {selectedProvider === p.id && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-fab-red rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
