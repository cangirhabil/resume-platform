"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, AlertCircle, RefreshCw, Download, FileText } from "lucide-react"
import { toast } from "sonner"

const TEMPLATES = [
  { id: "modern", name: "Modern", description: "Clean, contemporary design with accent colors" },
  { id: "classic", name: "Classic", description: "Traditional layout with serif fonts" },
  { id: "minimal", name: "Minimal", description: "Ultra-clean minimalist design" },
]

export default function ResumeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [resume, setResume] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [submitting, setSubmitting] = useState(false)

  const fetchResume = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setResume(data)
      setLoading(false)
      
      // Auto-trigger analysis if just uploaded
      if (data.status === "uploaded") {
        triggerAnalysis()
      }
      
      return data.status
    } catch (e) {
      toast.error("Error loading resume")
      setLoading(false)
      return null
    }
  }, [id])

  useEffect(() => {
    fetchResume()
  }, [fetchResume])

  // Polling for status updates
  useEffect(() => {
    if (!resume) return
    
    const shouldPoll = resume.status === "analyzing" || resume.status === "generating"
    if (!shouldPoll) return

    const interval = setInterval(async () => {
      const status = await fetchResume()
      if (status && status !== "analyzing" && status !== "generating") {
        clearInterval(interval)
        if (status === "completed") {
          toast.success("Resume generation completed!")
        } else if (status === "waiting_input") {
          toast.info("Analysis complete. Please answer the questions.")
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [resume?.status, fetchResume])

  async function triggerAnalysis() {
    try {
      const token = localStorage.getItem("token")
      const openaiKey = localStorage.getItem("openai_api_key") || ""
      const googleKey = localStorage.getItem("google_api_key") || ""
      
      const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}/analyze`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "x-openai-key": openaiKey,
          "x-google-key": googleKey
        }
      })
      
      if (res.ok) {
        toast.info("Analysis started...")
        setResume((prev: any) => ({ ...prev, status: "analyzing" }))
      } else {
        const error = await res.json()
        toast.error(error.detail || "Failed to start analysis")
      }
    } catch (e) {
      toast.error("Failed to start analysis")
    }
  }

  async function handleRewrite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const answers: Record<string, string> = {}
    resume.analysis_result?.clarification_questions?.forEach((q: string) => {
      answers[q] = formData.get(q) as string || ""
    })

    try {
      const token = localStorage.getItem("token")
      const openaiKey = localStorage.getItem("openai_api_key") || ""
      const googleKey = localStorage.getItem("google_api_key") || ""

      const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}/rewrite`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-openai-key": openaiKey,
          "x-google-key": googleKey
        },
        body: JSON.stringify({ answers, template: selectedTemplate })
      })
      
      if (res.ok) {
        toast.success("Rewriting resume...")
        setResume((prev: any) => ({ ...prev, status: "generating" }))
      } else {
        const error = await res.json()
        toast.error(error.detail || "Failed to start rewrite")
      }
    } catch (e) {
      toast.error("Failed to start rewrite")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDownload(format: "pdf" | "docx") {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}/download?format=${format}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `resume_${id}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      } else {
        toast.error(`Failed to download ${format.toUpperCase()}`)
      }
    } catch (e) {
      toast.error("Download failed")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-zinc-400">Loading resume...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{resume?.original_filename}</h2>
          <p className="text-zinc-400 text-sm">Resume Analysis & Enhancement</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => fetchResume()} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className={`px-3 py-1 rounded-full text-sm ${
            resume?.status === "completed" ? "bg-green-900/50 text-green-400" :
            resume?.status === "failed" ? "bg-red-900/50 text-red-400" :
            resume?.status === "waiting_input" ? "bg-indigo-900/50 text-indigo-400" :
            "bg-zinc-800 text-zinc-300"
          }`}>
            Status: {resume?.status?.replace("_", " ")}
          </div>
          {resume?.status === "completed" && (
            <div className="flex gap-2">
              <Button onClick={() => handleDownload("pdf")} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button onClick={() => handleDownload("docx")} variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/30 gap-2">
                <FileText className="h-4 w-4" />
                DOCX
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Analysis Report */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Analysis Report</CardTitle>
              <CardDescription>
                Score: <span className="text-indigo-400 font-bold text-lg">{resume?.analysis_result?.score || "N/A"}</span>/100
              </CardDescription>
            </CardHeader>
            <CardContent className="text-zinc-300 space-y-4">
              {resume?.status === "analyzing" ? (
                <div className="flex flex-col items-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 text-indigo-500 mb-2"/>
                  <p>Analyzing document structure and content...</p>
                  <p className="text-xs text-zinc-500 mt-2">This may take a minute</p>
                </div>
              ) : resume?.status === "generating" ? (
                <div className="flex flex-col items-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 text-indigo-500 mb-2"/>
                  <p>Generating enhanced resume...</p>
                  <p className="text-xs text-zinc-500 mt-2">Creating PDF and DOCX files</p>
                </div>
              ) : resume?.analysis_result ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Summary</h4>
                    <p className="text-sm text-zinc-400">{resume.analysis_result.summary}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Critical Issues</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-amber-400/80">
                      {resume.analysis_result.issues?.map((issue: string, i: number) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center py-8">
                  <AlertCircle className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-zinc-500">Waiting for analysis...</p>
                  {resume?.status === "uploaded" && (
                    <Button onClick={triggerAnalysis} className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                      Start Analysis
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Clarification Questions & Template Selection */}
        <div className="space-y-6">
          {/* Template Selection */}
          {resume?.status === "waiting_input" && (
            <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-cyan-500">
              <CardHeader>
                <CardTitle className="text-white">Choose Template</CardTitle>
                <CardDescription>Select a design for your enhanced resume.</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="text-white hover:bg-zinc-700">
                        <div>
                          <span className="font-medium">{template.name}</span>
                          <span className="text-zinc-400 text-sm ml-2">- {template.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Clarification Questions */}
          <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-indigo-500">
            <CardHeader>
              <CardTitle className="text-white">Clarification Needed</CardTitle>
              <CardDescription>Please answer to help us improve your resume.</CardDescription>
            </CardHeader>
            <CardContent>
              {!resume?.analysis_result?.clarification_questions ? (
                <p className="text-zinc-400 italic">Questions will appear here after analysis.</p>
              ) : (
                <form className="space-y-4" onSubmit={handleRewrite}>
                  {resume.analysis_result.clarification_questions.map((q: string, i: number) => (
                    <div key={i} className="space-y-2">
                      <Label htmlFor={q} className="text-zinc-200">{q}</Label>
                      <Textarea 
                        id={q} 
                        name={q} 
                        placeholder="Type your answer here..." 
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  ))}
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Submit and Rewrite
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Completion Card */}
          {resume?.status === "completed" && (
            <Card className="bg-gradient-to-br from-green-900/50 to-zinc-900 border-green-700">
              <CardContent className="py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Resume Enhanced!</h3>
                <p className="text-zinc-300 mb-4">Your professional resume is ready for download.</p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => handleDownload("pdf")} className="bg-green-600 hover:bg-green-700">
                    Download PDF
                  </Button>
                  <Button onClick={() => handleDownload("docx")} variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/30">
                    Download DOCX
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
