"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  PlusCircle, FileText, Loader2, RefreshCw, TrendingUp, 
  Upload, Target, CheckCircle2, Clock, AlertCircle,
  ArrowRight, Sparkles, Brain
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Resume {
  id: number
  original_filename: string
  status: string
  score: number | null
  created_at: string | null
  updated_at: string | null
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchResumes()
    fetchUser()
  }, [])

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/api/v1/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchResumes() {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/api/v1/resumes/", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setResumes(data)
      }
    } catch (e) {
      console.error("Failed to fetch resumes", e)
    } finally {
      setLoading(false)
    }
  }

  function getStatusInfo(status: string) {
    switch (status) {
      case "completed": 
        return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2, label: "Completed" }
      case "analyzing": 
      case "generating": 
        return { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock, label: "Processing" }
      case "waiting_input": 
        return { color: "text-fab-blue", bg: "bg-fab-blue/10", border: "border-fab-blue/20", icon: AlertCircle, label: "Needs Input" }
      case "failed": 
        return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: AlertCircle, label: "Failed" }
      default: 
        return { color: "text-[var(--muted-foreground)]", bg: "bg-[var(--surface)]", border: "border-[var(--border)]", icon: FileText, label: status }
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  // Calculate stats
  const stats = {
    total: resumes.length,
    completed: resumes.filter(r => r.status === "completed").length,
    avgScore: resumes.filter(r => r.score).reduce((acc, r) => acc + (r.score || 0), 0) / (resumes.filter(r => r.score).length || 1) || 0
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-fab-red border-t-transparent animate-spin mb-4" />
        <p className="text-[var(--muted-foreground)]">Loading your resumes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-barlow text-4xl md:text-5xl font-bold uppercase tracking-tight text-[var(--foreground)]">
            My Resumes
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage and optimize your professional documents
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={fetchResumes}
            className="border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/new">
            <Button className="bg-fab-red hover:bg-fab-red/90 text-white gap-2 shadow-lg shadow-fab-red/20">
              <PlusCircle className="w-4 h-4" />
              <span className="font-barlow font-bold uppercase tracking-wider">New Resume</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { 
            label: "Total Resumes", 
            value: stats.total, 
            icon: FileText, 
            color: "text-fab-blue",
            bg: "from-fab-blue/10 to-transparent"
          },
          { 
            label: "Completed", 
            value: stats.completed, 
            icon: CheckCircle2, 
            color: "text-emerald-500",
            bg: "from-emerald-500/10 to-transparent"
          },
          { 
            label: "Avg. ATS Score", 
            value: `${Math.round(stats.avgScore)}%`, 
            icon: Target, 
            color: "text-fab-red",
            bg: "from-fab-red/10 to-transparent"
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`p-5 rounded-2xl border border-[var(--border)] bg-gradient-to-br ${stat.bg} bg-[var(--card)] backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-pixel text-[var(--muted-foreground)] uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="font-barlow text-4xl font-bold text-[var(--foreground)]">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-6">
            <Upload className="w-8 h-8 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="font-barlow text-2xl font-bold uppercase text-[var(--foreground)] mb-2">
            No Resumes Yet
          </h3>
          <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
            Upload your first resume to get started with AI-powered optimization
          </p>
          <Link href="/dashboard/new">
            <Button className="bg-fab-red hover:bg-fab-red/90 text-white gap-2 shadow-lg shadow-fab-red/20">
              <Upload className="w-4 h-4" />
              <span className="font-barlow font-bold uppercase tracking-wider">Upload Resume</span>
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-pixel text-xs text-[var(--muted-foreground)] uppercase tracking-widest">Recent Resumes</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume, i) => {
              const statusInfo = getStatusInfo(resume.status)
              const StatusIcon = statusInfo.icon
              
              return (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link href={`/dashboard/resume/${resume.id}`}>
                    <div className="group p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-fab-red/30 hover:shadow-lg hover:shadow-fab-red/5 transition-all duration-300 h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[var(--foreground)] truncate group-hover:text-fab-red transition-colors">
                            {resume.original_filename}
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            {formatDate(resume.created_at)}
                          </p>
                        </div>
                        <div className={`p-2 rounded-lg ${statusInfo.bg} ${statusInfo.border} border`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-end justify-between">
                        <div>
                          {resume.score !== null ? (
                            <div className="flex items-center gap-2">
                              <span className="font-barlow text-3xl font-bold text-[var(--foreground)]">{resume.score}%</span>
                              <TrendingUp className="w-4 h-4 text-emerald-500" />
                            </div>
                          ) : (
                            <span className="text-sm text-[var(--muted-foreground)]">Score pending</span>
                          )}
                        </div>
                        <div className={`text-xs px-2.5 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border font-medium`}>
                          {statusInfo.label}
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="mt-4 flex items-center gap-1 text-fab-red opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium">View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}

            {/* Upload Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * resumes.length }}
            >
              <Link href="/dashboard/new">
                <div className="group p-5 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-fab-red/50 hover:bg-fab-red/5 transition-all duration-300 h-full min-h-[180px] flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--surface)] group-hover:bg-fab-red/10 flex items-center justify-center mb-4 transition-colors">
                    <PlusCircle className="w-6 h-6 text-[var(--muted-foreground)] group-hover:text-fab-red transition-colors" />
                  </div>
                  <p className="font-medium text-[var(--muted-foreground)] group-hover:text-fab-red transition-colors">
                    Upload New Resume
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    PDF or DOCX
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
