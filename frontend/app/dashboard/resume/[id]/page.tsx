"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Loader2, Download, FileText, 
  ArrowLeft, Send, Sparkles,
  RotateCcw, Check, ChevronRight
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

// Template Categories - only show if has templates
const TEMPLATE_CATEGORIES = [
  { id: "all", name: "All Templates" },
  { id: "picture", name: "Picture" },
  { id: "word", name: "Word" },
  { id: "simple", name: "Simple" },
  { id: "ats", name: "ATS" },
  { id: "two-column", name: "Two-column" },
  { id: "google-docs", name: "Google Docs" },
]

// Templates with preview images
const TEMPLATES = [
  { 
    id: "classic", 
    name: "Classic", 
    category: "ats", 
    preview: "/templates/classic.png",
    description: "Classically structured resume template, for a robust career history."
  },
  { 
    id: "traditional", 
    name: "Traditional", 
    category: "ats", 
    preview: "/templates/traditional.png",
    description: "Classic full-page resume template with sizable resume sections."
  },
  { 
    id: "professional", 
    name: "Professional", 
    category: "ats", 
    preview: "/templates/professional.png",
    description: "A touch of personality with a well-organized resume structure."
  },
]

// Get categories that have templates
function getAvailableCategories() {
  const categoriesWithTemplates = new Set(TEMPLATES.map(t => t.category))
  return TEMPLATE_CATEGORIES.filter(cat => 
    cat.id === "all" ? categoriesWithTemplates.size > 0 : categoriesWithTemplates.has(cat.id)
  )
}

// Helper to get LLM headers
function getLLMHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {}
  return {
    "x-openai-key": localStorage.getItem("openai_api_key") || "",
    "x-google-key": localStorage.getItem("google_api_key") || "",
    "x-anthropic-key": localStorage.getItem("anthropic_api_key") || "",
    "x-llm-provider": localStorage.getItem("llm_provider") || "google",
    "x-llm-model": localStorage.getItem("llm_model") || "gemini-2.5-flash",
  }
}

interface Message {
  id: string
  type: "ai" | "user"
  content: string
  isStreaming?: boolean
}

// Streaming Text Component
function StreamingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  
  useEffect(() => {
    if (isComplete) return
    let index = 0
    const speed = 12
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)
    
    return () => clearInterval(timer)
  }, [text, onComplete, isComplete])
  
  return (
    <>
      {displayedText}
      {!isComplete && <span className="inline-block w-1.5 h-4 bg-fab-red animate-pulse ml-0.5" />}
    </>
  )
}

// Chat Step Type
type ChatStep = "welcome" | "category" | "template" | "job_posting" | "analyzing" | "questions" | "generating" | "completed"

export default function ResumeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [loading, setLoading] = useState(true)
  const [resume, setResume] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Selection state
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [jobPosting, setJobPosting] = useState("")
  const [currentStep, setCurrentStep] = useState<ChatStep>("welcome")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  
  // Refs for preventing duplicates
  const initialized = useRef(false)
  const analysisShown = useRef(false)
  const completedShown = useRef(false)
  const messageQueue = useRef<string[]>([])
  const isProcessingQueue = useRef(false)
  const shownMessages = useRef<Set<string>>(new Set())

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Process message queue
  const processQueue = useCallback(() => {
    if (isProcessingQueue.current || messageQueue.current.length === 0) return
    isProcessingQueue.current = true
    const nextMessage = messageQueue.current.shift()!
    const msgId = Date.now().toString() + Math.random()
    setMessages(prev => [...prev, { id: msgId, type: "ai", content: nextMessage, isStreaming: true }])
    setIsTyping(true)
  }, [])

  const onMessageComplete = useCallback(() => {
    setMessages(prev => prev.map((msg, i) => 
      i === prev.length - 1 ? { ...msg, isStreaming: false } : msg
    ))
    setIsTyping(false)
    isProcessingQueue.current = false
    setTimeout(() => processQueue(), 200)
  }, [processQueue])

  const addAIMessage = useCallback((content: string) => {
    // Check if already shown or in queue
    if (shownMessages.current.has(content) || messageQueue.current.includes(content)) return
    shownMessages.current.add(content)
    messageQueue.current.push(content)
    processQueue()
  }, [processQueue])

  const addUserMessage = useCallback((content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), type: "user", content }])
  }, [])

  // Initial fetch
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    
    const fetchInitial = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        setResume(data)
        setLoading(false)
        
        // Start chat flow
        if (data.status === "uploaded" || data.status === "waiting_input") {
          addAIMessage(`Hello! 👋 I've received your resume: **${data.original_filename}**\n\nLet's create a tailored, professional CV together. First, choose a template category:`)
          setCurrentStep("category")
        } else if (data.status === "analyzing") {
          addAIMessage("I'm analyzing your resume... ⏳")
          setCurrentStep("analyzing")
          setIsProcessing(true)
        } else if (data.status === "generating") {
          addAIMessage("Generating your enhanced resume... ✨")
          setCurrentStep("generating")
          setIsProcessing(true)
        } else if (data.status === "completed") {
          addAIMessage("🎉 Your resume is ready! Download it below:")
          setCurrentStep("completed")
        } else if (data.status === "failed") {
          addAIMessage("❌ An error occurred. Please check your API settings.")
        }
      } catch (e) {
        toast.error("Error loading resume")
        setLoading(false)
      }
    }
    fetchInitial()
  }, [id, addAIMessage])

  // Poll for status
  useEffect(() => {
    if (!resume || (resume.status !== "analyzing" && resume.status !== "generating")) return
    
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.status !== resume.status) {
          setResume(data)
          setIsProcessing(false)
          
          if (data.status === "waiting_input") {
            handleAnalysisComplete(data)
          } else if (data.status === "completed") {
            if (!completedShown.current) {
              completedShown.current = true
              addAIMessage("🎉 Your enhanced resume is ready!\n\nI've optimized it for ATS compatibility and tailored it based on your inputs. Download below:")
              setCurrentStep("completed")
            }
          } else if (data.status === "failed") {
            addAIMessage("❌ Processing failed. Check your API settings.")
          }
        }
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [resume?.status, id])

  // Handle analysis complete
  const handleAnalysisComplete = useCallback((data: any) => {
    if (analysisShown.current) return
    analysisShown.current = true
    
    const analysis = data.analysis_result
    if (!analysis) return
    
    addAIMessage(`## Analysis Complete! 🎯\n\n**Score: ${analysis.score}/100**\n\n${analysis.summary}`)
    
    const questions = analysis.clarification_questions || []
    
    if (questions.length > 0) {
      // Has questions - go through Q&A flow
      setTimeout(() => {
        addAIMessage("I have a few questions to make your resume even better:")
        setTimeout(() => {
          const q = questions[0]
          addAIMessage(`❓ ${q}`)
          setCurrentQuestionIndex(0)
          setCurrentStep("questions")
        }, 1500)
      }, 2000)
    } else {
      // No questions needed - proceed directly to generation
      setTimeout(() => {
        addAIMessage("Your resume looks great! I have all the information I need. Generating your tailored resume... ✨")
        setCurrentStep("generating")
        setIsProcessing(true)
        generateResume({})
      }, 2000)
    }
  }, [addAIMessage])

  // Handle category select
  function handleCategorySelect(categoryId: string) {
    setSelectedCategory(categoryId)
    const cat = TEMPLATE_CATEGORIES.find(c => c.id === categoryId)
    addUserMessage(`Category: ${cat?.name}`)
    
    setTimeout(() => {
      addAIMessage("Great! Now select a template that fits your style:")
      setCurrentStep("template")
    }, 300)
  }

  // Handle template select
  function handleTemplateSelect(templateId: string) {
    setSelectedTemplate(templateId)
    const template = TEMPLATES.find(t => t.id === templateId)
    addUserMessage(`Template: ${template?.name}`)
    
    setTimeout(() => {
      addAIMessage("Excellent choice! 🎨\n\nNow, do you have a specific job posting you're targeting?\n\n**Paste the job description** below, or type 'skip' if you want a general resume:")
      setCurrentStep("job_posting")
    }, 300)
  }

  // Handle job posting submit
  function handleJobPostingSubmit() {
    if (!inputValue.trim()) return
    
    const isSkip = inputValue.toLowerCase().trim() === "skip"
    
    if (isSkip) {
      addUserMessage("Skip - general resume")
      setJobPosting("")
    } else {
      addUserMessage(inputValue.length > 100 ? inputValue.substring(0, 100) + "..." : inputValue)
      setJobPosting(inputValue)
    }
    setInputValue("")
    
    setTimeout(() => {
      if (isSkip) {
        addAIMessage("No problem! I'll create a versatile resume that works across different opportunities.\n\nAnalyzing your resume now... ⏳")
      } else {
        addAIMessage("Perfect! I'll tailor your resume specifically for this position.\n\nAnalyzing your resume and the job requirements... ⏳")
      }
      setCurrentStep("analyzing")
      setIsProcessing(true)
      startAnalysis()
    }, 300)
  }

  // Start analysis
  async function startAnalysis() {
    try {
      const token = localStorage.getItem("token")
      const llmHeaders = getLLMHeaders()
      
      const provider = llmHeaders["x-llm-provider"]
      const hasKey = 
        (provider === "google" && llmHeaders["x-google-key"]) ||
        (provider === "openai" && llmHeaders["x-openai-key"]) ||
        (provider === "anthropic" && llmHeaders["x-anthropic-key"])
      
      if (!hasKey) {
        setIsProcessing(false)
        addAIMessage("⚠️ API key not configured. Please set it in Settings.")
        return
      }
      
      const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}/analyze`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          ...llmHeaders
        },
        body: JSON.stringify({ job_posting: jobPosting, template: selectedTemplate || "professional" })
      })
      
      if (res.ok) {
        setResume((prev: any) => ({ ...prev, status: "analyzing" }))
      } else {
        setIsProcessing(false)
        addAIMessage("❌ Analysis failed. Please try again.")
      }
    } catch (e) {
      setIsProcessing(false)
      addAIMessage("❌ Connection error.")
    }
  }

  // Handle answer submit
  async function handleAnswerSubmit() {
    if (!inputValue.trim() || isTyping) return
    
    const questions = resume?.analysis_result?.clarification_questions || []
    const currentQuestion = questions[currentQuestionIndex]
    
    addUserMessage(inputValue)
    const newAnswers = { ...answers, [currentQuestion]: inputValue }
    setAnswers(newAnswers)
    setInputValue("")
    
    const nextIndex = currentQuestionIndex + 1
    
    if (nextIndex < questions.length) {
      setTimeout(() => {
        const responses = ["Thanks! 👍", "Got it!", "Great!", "Perfect!"]
        addAIMessage(responses[Math.floor(Math.random() * responses.length)])
        setTimeout(() => {
          addAIMessage(`❓ ${questions[nextIndex]}`)
          setCurrentQuestionIndex(nextIndex)
        }, 1000)
      }, 300)
    } else {
      setTimeout(() => {
        addAIMessage("Awesome! I have everything I need. Generating your tailored resume... ✨")
        setCurrentStep("generating")
        setIsProcessing(true)
        generateResume(newAnswers)
      }, 300)
    }
  }

  // Generate resume
  async function generateResume(allAnswers: Record<string, string>) {
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
        body: JSON.stringify({ 
          answers: allAnswers, 
          template: selectedTemplate || "professional",
          job_posting: jobPosting
        })
      })
      
      if (res.ok) {
        setResume((prev: any) => ({ ...prev, status: "generating" }))
      } else {
        setIsProcessing(false)
        addAIMessage("❌ Generation failed. Please try again.")
      }
    } catch (e) {
      setIsProcessing(false)
      addAIMessage("❌ Connection error.")
    }
  }

  // Handle download
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
        a.download = `resume_tailored.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
        toast.success(`${format.toUpperCase()} downloaded!`)
      } else {
        toast.error("Download failed")
      }
    } catch (e) {
      toast.error("Download error")
    }
  }

  // Get filtered templates
  const filteredTemplates = selectedCategory === "all" 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory)
  
  const availableCategories = getAvailableCategories()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-fab-red animate-spin mb-4" />
        <p className="text-[var(--muted-foreground)]">Loading...</p>
      </div>
    )
  }

  const questions = resume?.analysis_result?.clarification_questions || []
  const showInput = (currentStep === "job_posting" || currentStep === "questions") && !isTyping && !isProcessing

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition mb-3 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fab-red to-fab-blue flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-barlow text-xl font-bold uppercase tracking-tight text-[var(--foreground)]">
              CV Assistant
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">{resume?.original_filename}</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg">
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.type === "user" 
                    ? "bg-fab-red text-white rounded-br-sm" 
                    : "bg-[var(--surface)] text-[var(--foreground)] rounded-bl-sm border border-[var(--border)]"
                }`}>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.isStreaming ? (
                      <StreamingText text={msg.content} onComplete={onMessageComplete} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Category Selection */}
          {currentStep === "category" && !isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? "bg-fab-red text-white"
                        : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:border-fab-red"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Template Selection */}
          {currentStep === "template" && !isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-3 gap-3">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${
                      selectedTemplate === template.id
                        ? "border-fab-red ring-2 ring-fab-red ring-offset-2 ring-offset-[var(--background)]"
                        : "border-[var(--border)] hover:border-fab-red/50"
                    }`}
                  >
                    <div className="aspect-[3/4] relative bg-white">
                      <Image
                        src={template.preview}
                        alt={template.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="p-2 bg-[var(--surface)]">
                      <p className="text-sm font-medium text-[var(--foreground)]">{template.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{template.description}</p>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-fab-red rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Processing indicator */}
          {isProcessing && !isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <Loader2 className="w-4 h-4 text-fab-red animate-spin" />
              <span className="text-sm text-[var(--muted-foreground)]">
                {currentStep === "analyzing" ? "Analyzing..." : "Generating..."}
              </span>
            </motion.div>
          )}

          {/* Download Buttons */}
          {currentStep === "completed" && !isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <Button onClick={() => handleDownload("pdf")} className="flex-1 bg-fab-red hover:bg-fab-red/90 text-white py-5">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={() => handleDownload("docx")} variant="outline" className="flex-1 border-[var(--border)] py-5">
                <FileText className="w-4 h-4 mr-2" />
                Download DOCX
              </Button>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {showInput && (
          <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentStep === "job_posting" 
                  ? "Paste job description here, or type 'skip'..." 
                  : "Type your answer..."}
                className="flex-1 min-h-[60px] max-h-[150px] bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    currentStep === "job_posting" ? handleJobPostingSubmit() : handleAnswerSubmit()
                  }
                }}
              />
              <Button
                onClick={() => currentStep === "job_posting" ? handleJobPostingSubmit() : handleAnswerSubmit()}
                disabled={!inputValue.trim()}
                className="bg-fab-red hover:bg-fab-red/90 text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Retry */}
      {resume?.status === "failed" && (
        <div className="mt-4 flex gap-2">
          <Link href="/dashboard/settings" className="flex-1">
            <Button variant="outline" className="w-full text-sm">Check Settings</Button>
          </Link>
          <Button onClick={() => window.location.reload()} className="flex-1 bg-fab-red text-white text-sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
