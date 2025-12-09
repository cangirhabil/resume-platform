"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, FileText, Loader2,  CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function NewResumePage() {
  const router = useRouter()
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
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

      if (!res.ok) {
        throw new Error("Upload failed")
      }

      const data = await res.json()
      toast.success("Resume uploaded successfully")
      // Redirect to the analysis page
      router.push(`/dashboard/resume/${data.id}`)
      
    } catch (error) {
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Upload Resume</h2>
        <p className="text-zinc-400">We&apos;ll analyze your existing resume to identify gaps and improvements.</p>
      </div>

      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragOver 
            ? "border-indigo-500 bg-indigo-500/10" 
            : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-16 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx" 
            onChange={handleFileSelect}
          />
          
          <div className={`h-20 w-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
            uploading ? "bg-indigo-500/20" : "bg-zinc-800"
          }`}>
             {uploading ? (
               <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
             ) : (
               <UploadCloud className="h-10 w-10 text-zinc-400" />
             )}
          </div>

          <h3 className="text-xl font-medium text-white mb-2">
            {uploading ? "Uploading..." : "Click to upload or drag and drop"}
          </h3>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            PDF or DOCX (Max 10MB)
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button variant="link" className="text-zinc-400" onClick={() => router.push("/dashboard")}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
