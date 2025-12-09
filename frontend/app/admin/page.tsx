"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { 
  Loader2, Users, FileText, DollarSign, RefreshCw, 
  Shield, ShieldOff, Home, Settings, LayoutDashboard, 
  ChevronRight
} from "lucide-react"

interface Stats {
  users: number
  resumes: number
  revenue: number
  status_breakdown: Record<string, number>
}

interface User {
  id: number
  email: string
  is_active: boolean
  is_superuser: boolean
  credits: number
  created_at: string | null
  resume_count: number
}

interface Resume {
  id: number
  user_id: number
  user_email: string
  original_filename: string
  status: string
  score: number | null
  created_at: string | null
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "resumes">("overview")

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/api/v1/admin/stats", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      if (res.status === 403) {
        toast.error("Admin access required")
        router.push("/dashboard")
        return
      }
      
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (e) {
      console.error("Failed to fetch stats", e)
      toast.error("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/api/v1/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (e) {
      toast.error("Failed to load users")
    }
  }

  async function fetchResumes() {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/api/v1/admin/resumes", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setResumes(data.resumes)
      }
    } catch (e) {
      toast.error("Failed to load resumes")
    }
  }

  async function toggleUserActive(userId: number, currentStatus: boolean) {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}?is_active=${!currentStatus}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success("User updated")
        fetchUsers()
      }
    } catch (e) {
      toast.error("Failed to update user")
    }
  }

  async function toggleSuperuser(userId: number, currentStatus: boolean) {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}?is_superuser=${!currentStatus}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success("User updated")
        fetchUsers()
      }
    } catch (e) {
      toast.error("Failed to update user")
    }
  }

  function handleTabChange(tab: "overview" | "users" | "resumes") {
    setActiveTab(tab)
    if (tab === "users" && users.length === 0) {
      fetchUsers()
    } else if (tab === "resumes" && resumes.length === 0) {
      fetchResumes()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden md:block">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleTabChange("overview")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              activeTab === "overview" 
                ? "bg-zinc-800 text-white" 
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => handleTabChange("users")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              activeTab === "users" 
                ? "bg-zinc-800 text-white" 
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button
            onClick={() => handleTabChange("resumes")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              activeTab === "resumes" 
                ? "bg-zinc-800 text-white" 
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <FileText className="h-4 w-4" />
            Resumes
          </button>
          
          <div className="pt-4 mt-4 border-t border-zinc-800">
            <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Shield className="h-4 w-4 text-purple-400" />
            <span>Admin Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white capitalize">{activeTab}</span>
          </div>
          <Button onClick={fetchStats} variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">System Overview</h2>
              
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-200">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-indigo-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.users}</div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-200">Total Resumes</CardTitle>
                    <FileText className="h-4 w-4 text-cyan-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.resumes}</div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-200">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">${stats.revenue.toFixed(2)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Breakdown */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-zinc-200">Resume Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(stats.status_breakdown).map(([status, count]) => (
                      <div key={status} className="bg-zinc-800 px-4 py-2 rounded-lg">
                        <span className="text-zinc-400 capitalize">{status.replace("_", " ")}: </span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">ID</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Email</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Credits</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Resumes</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                            <td className="py-3 px-4 text-zinc-300">{user.id}</td>
                            <td className="py-3 px-4 text-white">{user.email}</td>
                            <td className="py-3 px-4 text-indigo-400">{user.credits}</td>
                            <td className="py-3 px-4 text-zinc-300">{user.resume_count}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                {user.is_superuser && (
                                  <span className="px-2 py-1 text-xs rounded bg-purple-900/50 text-purple-400">Admin</span>
                                )}
                                <span className={`px-2 py-1 text-xs rounded ${user.is_active ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                                  {user.is_active ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleUserActive(user.id, user.is_active)}
                                  className="text-zinc-400 hover:text-white"
                                >
                                  {user.is_active ? "Deactivate" : "Activate"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleSuperuser(user.id, user.is_superuser)}
                                  className="text-zinc-400 hover:text-white"
                                  title={user.is_superuser ? "Remove admin" : "Make admin"}
                                >
                                  {user.is_superuser ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                      <div className="text-center py-8 text-zinc-500">
                        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                        Loading users...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Resumes Tab */}
          {activeTab === "resumes" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">All Resumes</h2>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">ID</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">User</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Filename</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Score</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumes.map((resume) => (
                          <tr key={resume.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                            <td className="py-3 px-4 text-zinc-300">{resume.id}</td>
                            <td className="py-3 px-4 text-zinc-300">{resume.user_email}</td>
                            <td className="py-3 px-4 text-white truncate max-w-[200px]">{resume.original_filename}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded ${
                                resume.status === "completed" ? "bg-green-900/50 text-green-400" :
                                resume.status === "failed" ? "bg-red-900/50 text-red-400" :
                                "bg-zinc-700 text-zinc-300"
                              }`}>
                                {resume.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-indigo-400">{resume.score ?? "-"}</td>
                            <td className="py-3 px-4 text-zinc-400 text-sm">
                              {resume.created_at ? new Date(resume.created_at).toLocaleDateString() : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {resumes.length === 0 && (
                      <div className="text-center py-8 text-zinc-500">
                        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                        Loading resumes...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
