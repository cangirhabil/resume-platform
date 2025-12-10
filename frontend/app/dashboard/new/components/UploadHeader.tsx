
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export function UploadHeader() {
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
      <h1 className="font-barlow text-4xl md:text-5xl font-bold uppercase tracking-tight text-[var(--foreground)]">
        Upload Resume
      </h1>
      <p className="text-[var(--muted-foreground)] mt-2">
        We'll analyze your resume and optimize it with AI
      </p>
    </motion.div>
  )
}
