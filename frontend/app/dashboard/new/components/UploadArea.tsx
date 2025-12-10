
"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { UploadCloud, Loader2, FileText, Sparkles } from "lucide-react"

interface UploadAreaProps {
  uploading: boolean
  uploadProgress: number
  onUpload: (file: File) => void
}

export function UploadArea({ uploading, uploadProgress, onUpload }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)
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
      onUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0])
    }
  }

  return (
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
  )
}
