
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export function SettingsHeader() {
  return (
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
  )
}
