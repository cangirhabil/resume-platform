"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { UploadHeader } from "./components/UploadHeader"
import { UploadArea } from "./components/UploadArea"
import { UploadTips } from "./components/UploadTips"

export default function NewResumePage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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
      <UploadHeader />
      
      <UploadArea 
        uploading={uploading} 
        uploadProgress={uploadProgress} 
        onUpload={handleUpload} 
      />

      <UploadTips />

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
