
import { motion } from "framer-motion"

export function UploadTips() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
    >
      <h4 className="font-pixel text-xs text-[var(--muted-foreground)] uppercase tracking-widest mb-4">
        Tips for Best Results
      </h4>
      <ul className="space-y-3">
        {[
          "Use a clean, simple format for your resume",
          "Include your most recent work experience",
          "List relevant skills and technologies",
          "Add measurable achievements when possible"
        ].map((tip, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
            <div className="w-1.5 h-1.5 rounded-full bg-fab-red mt-2 flex-shrink-0" />
            {tip}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
