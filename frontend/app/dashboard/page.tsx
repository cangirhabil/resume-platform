"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText, Loader2, RefreshCw, TrendingUp } from "lucide-react"
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

  useEffect(() => {
    fetchResumes()
  }, [])

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

  async function deleteResume(id: number) {
    // Note: Delete endpoint not yet implemented - just remove from UI for now
    toast.info("Delete functionality coming soon")
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "analyzing": 
      case "generating": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "waiting_input": return "bg-fab-blue/10 text-fab-blue border-fab-blue/20"
      case "failed": return "bg-red-500/10 text-red-500 border-red-500/20"
      default: return "bg-[var(--surface)] text-[var(--muted-foreground)] border-[var(--border)]"
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-barlow text-4xl font-bold tracking-tight text-[var(--foreground)] uppercase">My Resumes</h2>
          <p className="text-[var(--muted-foreground)]">Manage and optimize your professional documents.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchResumes} 
            className="border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/new">
            <Button className="bg-fab-red hover:bg-fab-red/90 text-white font-barlow font-bold uppercase tracking-wider gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-fab-red" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Link key={resume.id} href={`/dashboard/resume/${resume.id}`}>
              <Card className="bg-[var(--card)] border-[var(--border)] hover:border-fab-red/50 transition cursor-pointer group h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[var(--foreground)] truncate max-w-[200px]">
                    {resume.original_filename}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-fab-red transition" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      {resume.score !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-barlow font-bold text-[var(--foreground)]">{resume.score}%</span>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                      ) : (
                        <div className="text-lg font-medium text-[var(--muted-foreground)]">No score yet</div>
                      )}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(resume.status)}`}>
                      {resume.status.replace("_", " ")}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-2">
                    Created: {formatDate(resume.created_at)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Add New Card */}
          <Link href="/dashboard/new" className="border-dashed border-2 border-[var(--border)] rounded-xl flex flex-col items-center justify-center p-8 hover:border-fab-red/50 hover:bg-fab-red/5 transition group min-h-[180px]">
            <div className="h-12 w-12 rounded-full bg-[var(--surface)] flex items-center justify-center mb-4 group-hover:bg-fab-red/20 transition">
              <PlusCircle className="h-6 w-6 text-[var(--muted-foreground)] group-hover:text-fab-red" />
            </div>
            <p className="text-[var(--muted-foreground)] font-medium group-hover:text-fab-red">Upload New Resume</p>
          </Link>
        </div>
      )}

      {!loading && resumes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)] mb-4">You haven't uploaded any resumes yet.</p>
          <Link href="/dashboard/new">
            <Button className="bg-fab-red hover:bg-fab-red/90 text-white font-barlow font-bold uppercase tracking-wider gap-2">
              <PlusCircle className="h-4 w-4" />
              Upload Your First Resume
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
