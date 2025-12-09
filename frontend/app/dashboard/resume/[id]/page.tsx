"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, AlertCircle, RefreshCw, Download, FileText, Settings } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const TEMPLATES = [
  { id: "modern", name: "Modern", description: "Clean, contemporary design with accent colors" },
  { id: "classic", name: "Classic", description: "Traditional layout with serif fonts" },
  { id: "minimal", name: "Minimal", description: "Ultra-clean minimalist design" },
]

// Helper to get all LLM config headers
function getLLMHeaders(): Record<string, string> {
  return {
    "x-openai-key": localStorage.getItem("openai_api_key") || "",
    "x-google-key": localStorage.getItem("google_api_key") || "",
    "x-anthropic-key": localStorage.getItem("anthropic_api_key") || "",
    "x-llm-provider": localStorage.getItem("llm_provider") || "google",
    "x-llm-model": localStorage.getItem("llm_model") || "gemini-1.5-flash",
  }
}

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
        } else if (status === "failed") {
          toast.error("Processing failed. Please check your API key settings.")
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [resume?.status, fetchResume])

  async function triggerAnalysis() {
    try {
      const token = localStorage.getItem("token")
      const llmHeaders = getLLMHeaders()
      
      // Check if API key is configured
      const provider = llmHeaders["x-llm-provider"]
      const hasKey = 
        (provider === "google" && llmHeaders["x-google-key"]) ||
        (provider === "openai" && llmHeaders["x-openai-key"]) ||
        (provider === "anthropic" && llmHeaders["x-anthropic-key"])
      
      if (!hasKey) {
        toast.error("Please configure your API key in Settings first")
        return
      }
      
      const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}/analyze`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          ...llmHeaders
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
      const llmHeaders = getLLMHeaders()

      const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}/rewrite`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          ...llmHeaders
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
        <Loader2 className="h-10 w-10 animate-spin text-fab-red mb-4" />
        <p className="text-[var(--muted-foreground)]">Loading resume...</p>
      </div>
    )
  }

  // Check for errors in analysis
  const hasError = resume?.analysis_result?.error || resume?.status === "failed"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">{resume?.original_filename}</h2>
          <p className="text-[var(--muted-foreground)] text-sm">Resume Analysis & Enhancement</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings">
            <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)]">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Button variant="outline" onClick={() => fetchResume()} className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)]">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className={`px-3 py-1 rounded-full text-sm ${
            resume?.status === "completed" ? "bg-green-900/50 text-green-400" :
            resume?.status === "failed" ? "bg-red-900/50 text-red-400" :
            resume?.status === "waiting_input" ? "bg-fab-red/10 text-fab-red" :
            "bg-[var(--surface)] text-[var(--foreground)]"
          }`}>
            Status: {resume?.status?.replace("_", " ")}
          </div>
          {resume?.status === "completed" && (
            <div className="flex gap-2">
              <Button onClick={() => handleDownload("pdf")} className="bg-green-600 hover:bg-green-700 text-[var(--foreground)] gap-2">
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

      {/* Error State */}
      {hasError && (
        <Card className="bg-red-900/30 border-red-700">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-300">Processing Failed</h3>
                <p className="text-red-200/80 mt-1">
                  {resume?.analysis_result?.error || "An error occurred during processing."}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="border-red-600 text-red-300 hover:bg-red-900/30">
                      <Settings className="h-4 w-4 mr-2" />
                      Check API Settings
                    </Button>
                  </Link>
                  <Button onClick={triggerAnalysis} className="bg-red-600 hover:bg-red-700">
                    Retry Analysis
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Analysis Report */}
        <div className="space-y-6">
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">Analysis Report</CardTitle>
              <CardDescription>
                Score: <span className="text-fab-red font-bold text-lg">{resume?.analysis_result?.score || "N/A"}</span>/100
              </CardDescription>
            </CardHeader>
            <CardContent className="text-[var(--foreground)] space-y-4">
              {resume?.status === "analyzing" ? (
                <div className="flex flex-col items-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 text-fab-red mb-2"/>
                  <p>Analyzing document structure and content...</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-2">This may take a minute</p>
                </div>
              ) : resume?.status === "generating" ? (
                <div className="flex flex-col items-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 text-fab-red mb-2"/>
                  <p>Generating enhanced resume...</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-2">Creating PDF and DOCX files</p>
                </div>
              ) : resume?.analysis_result && !hasError ? (
                <div className="space-y-4">
                  {/* Extracted Info */}
                  {resume.analysis_result.candidate_info && (
                    <div className="bg-[var(--surface)] p-3 rounded-lg">
                      <h4 className="font-semibold text-[var(--foreground)] mb-2">Extracted Candidate Info</h4>
                      <div className="text-sm text-[var(--muted-foreground)] space-y-1">
                        {resume.analysis_result.candidate_info.name && (
                          <p><span className="text-[var(--muted-foreground)]">Name:</span> {resume.analysis_result.candidate_info.name}</p>
                        )}
                        {resume.analysis_result.candidate_info.email && (
                          <p><span className="text-[var(--muted-foreground)]">Email:</span> {resume.analysis_result.candidate_info.email}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)] mb-2">Summary</h4>
                    <p className="text-sm text-[var(--muted-foreground)]">{resume.analysis_result.summary}</p>
                  </div>
                  
                  {resume.analysis_result.strengths && (
                    <div>
                      <h4 className="font-semibold text-[var(--foreground)] mb-2">Strengths</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-green-400/80">
                        {resume.analysis_result.strengths.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)] mb-2">Issues to Address</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-amber-400/80">
                      {resume.analysis_result.issues?.map((issue: string, i: number) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : !hasError ? (
                <div className="space-y-2 text-center py-8">
                  <AlertCircle className="h-8 w-8 text-[var(--muted-foreground)] mx-auto mb-2" />
                  <p className="text-[var(--muted-foreground)]">Waiting for analysis...</p>
                  {resume?.status === "uploaded" && (
                    <Button onClick={triggerAnalysis} className="mt-4 bg-fab-red hover:bg-fab-red/90">
                      Start Analysis
                    </Button>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Clarification Questions & Template Selection */}
        <div className="space-y-6">
          {/* Template Selection */}
          {resume?.status === "waiting_input" && (
            <Card className="bg-[var(--card)] border-[var(--border)] border-l-4 border-l-cyan-500">
              <CardHeader>
                <CardTitle className="text-[var(--foreground)]">Choose Template</CardTitle>
                <CardDescription>Select a design for your enhanced resume.</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--surface)] border-[var(--border)]">
                    {TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="text-[var(--foreground)] hover:bg-[var(--surface-hover)]">
                        <div>
                          <span className="font-medium">{template.name}</span>
                          <span className="text-[var(--muted-foreground)] text-sm ml-2">- {template.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Clarification Questions */}
          <Card className="bg-[var(--card)] border-[var(--border)] border-l-4 border-l-fab-red">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">Clarification Needed</CardTitle>
              <CardDescription>Please answer to help us improve your resume.</CardDescription>
            </CardHeader>
            <CardContent>
              {!resume?.analysis_result?.clarification_questions ? (
                <p className="text-[var(--muted-foreground)] italic">Questions will appear here after analysis.</p>
              ) : (
                <form className="space-y-4" onSubmit={handleRewrite}>
                  {resume.analysis_result.clarification_questions.map((q: string, i: number) => (
                    <div key={i} className="space-y-2">
                      <Label htmlFor={q} className="text-[var(--foreground)]">{q}</Label>
                      <Textarea 
                        id={q} 
                        name={q} 
                        placeholder="Type your answer here..." 
                        className="bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]"
                      />
                    </div>
                  ))}
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-fab-red hover:bg-fab-red/90 gap-2"
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
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Resume Enhanced!</h3>
                <p className="text-[var(--foreground)] mb-4">Your professional resume is ready for download.</p>
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
