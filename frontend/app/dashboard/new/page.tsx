"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { UploadCloud, Loader2, FileText, Sparkles, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewResumePage() {
  const router = useRouter()
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0])
    }
  }

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
      toast.error("Invalid file type. Please upload PDF or DOCX.")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/api/v1/resumes/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!res.ok) {
        throw new Error("Upload failed")
      }

      const data = await res.json()
      toast.success("Resume uploaded successfully!")
      router.push(`/dashboard/resume/${data.id}`)
      
    } catch (error) {
      clearInterval(progressInterval)
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
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
        <h1 className="font-barlow text-4xl md:text-5xl font-bold uppercase tracking-tight text-[var(--foreground)]">
          Upload Resume
        </h1>
        <p className="text-[var(--muted-foreground)] mt-2">
          We'll analyze your resume and optimize it with AI
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
          isDragOver 
            ? "border-fab-red bg-fab-red/5 scale-[1.02]" 
            : uploading
            ? "border-fab-blue bg-fab-blue/5"
            : "border-[var(--border)] bg-[var(--card)] hover:border-fab-red/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Progress Bar */}
        {uploading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--surface)]">
            <motion.div 
              className="h-full bg-gradient-to-r from-fab-red to-fab-blue"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div 
          className="flex flex-col items-center justify-center py-20 px-8 text-center cursor-pointer"
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx" 
            onChange={handleFileSelect}
            disabled={uploading}
          />
          
          {/* Icon */}
          <motion.div 
            className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              uploading 
                ? "bg-fab-blue/20" 
                : isDragOver
                ? "bg-fab-red/20"
                : "bg-[var(--surface)]"
            }`}
            animate={uploading ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {uploading ? (
              <Loader2 className="w-10 h-10 text-fab-blue animate-spin" />
            ) : isDragOver ? (
              <Sparkles className="w-10 h-10 text-fab-red" />
            ) : (
              <UploadCloud className="w-10 h-10 text-[var(--muted-foreground)]" />
            )}
          </motion.div>

          {/* Text */}
          <h3 className="font-barlow text-2xl font-bold uppercase text-[var(--foreground)] mb-2">
            {uploading 
              ? "Uploading..." 
              : isDragOver 
              ? "Drop it here!" 
              : "Drag & Drop"}
          </h3>
          <p className="text-[var(--muted-foreground)] mb-6">
            {uploading 
              ? "Please wait while we process your file"
              : "or click to browse your files"}
          </p>

          {/* File Types */}
          {!uploading && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <FileText className="w-4 h-4 text-red-500" />
                <span className="text-sm text-[var(--muted-foreground)]">PDF</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-[var(--muted-foreground)]">DOCX</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tips */}
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

      {/* Cancel Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-6"
      >
        <Button 
          variant="ghost" 
          onClick={() => router.push("/dashboard")}
          className="text-[var(--muted-foreground)]"
          disabled={uploading}
        >
          Cancel
        </Button>
      </motion.div>
    </div>
  )
}
