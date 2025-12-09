"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText, Trash2, Loader2, RefreshCw } from "lucide-react"
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
      case "completed": return "text-green-400"
      case "analyzing": 
      case "generating": return "text-amber-400"
      case "waiting_input": return "text-indigo-400"
      case "failed": return "text-red-400"
      default: return "text-zinc-400"
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
          <h2 className="text-3xl font-bold tracking-tight text-white">My Resumes</h2>
          <p className="text-zinc-400">Manage and optimize your professional documents.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchResumes} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Link key={resume.id} href={`/dashboard/resume/${resume.id}`}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition cursor-pointer group h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">
                    {resume.original_filename}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      {resume.score !== null ? (
                        <div className="text-2xl font-bold text-white">{resume.score}% Score</div>
                      ) : (
                        <div className="text-lg font-medium text-zinc-500">No score yet</div>
                      )}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full bg-zinc-800 ${getStatusColor(resume.status)}`}>
                      {resume.status.replace("_", " ")}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Created: {formatDate(resume.created_at)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Add New Card */}
          <Link href="/dashboard/new" className="border-dashed border-2 border-zinc-800 rounded-xl flex flex-col items-center justify-center p-8 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition group min-h-[180px]">
            <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition">
              <PlusCircle className="h-6 w-6 text-zinc-500 group-hover:text-indigo-400" />
            </div>
            <p className="text-zinc-400 font-medium group-hover:text-indigo-300">Upload New Resume</p>
          </Link>
        </div>
      )}

      {!loading && resumes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">You haven't uploaded any resumes yet.</p>
          <Link href="/dashboard/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <PlusCircle className="h-4 w-4" />
              Upload Your First Resume
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
