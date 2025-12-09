"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  Loader2, Users, FileText, DollarSign, RefreshCw, 
  Shield, ShieldOff, Home, LayoutDashboard, 
  ChevronRight, LogOut, X, Save, Coins, Mail, Calendar, FileStack
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

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "resumes">("overview")
  
  // User Detail Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editCredits, setEditCredits] = useState<number>(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem("admin_token")
    const adminVerified = localStorage.getItem("admin_verified")
    
    if (!adminToken || adminVerified !== "true") {
      toast.error("Please login to admin panel")
      router.push("/admin")
      return
    }
    
    fetchStats()
  }, [router])

  function getAdminToken() {
    return localStorage.getItem("admin_token")
  }

  async function fetchStats() {
    setLoading(true)
    try {
      const token = getAdminToken()
      const res = await fetch("http://localhost:8000/api/v1/admin/stats", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      if (res.status === 403) {
        toast.error("Session expired. Please login again.")
        handleLogout()
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
      const token = getAdminToken()
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
      const token = getAdminToken()
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
      const token = getAdminToken()
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
      const token = getAdminToken()
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

  function handleLogout() {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_verified")
    router.push("/admin")
  }

  function openUserModal(user: User) {
    setSelectedUser(user)
    setEditCredits(user.credits)
  }

  function closeUserModal() {
    setSelectedUser(null)
    setEditCredits(0)
  }

  async function saveUserCredits() {
    if (!selectedUser) return
    setSaving(true)
    try {
      const token = getAdminToken()
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${selectedUser.id}?credits=${editCredits}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success("Credits updated successfully")
        fetchUsers()
        setSelectedUser({ ...selectedUser, credits: editCredits })
      } else {
        toast.error("Failed to update credits")
      }
    } catch (e) {
      toast.error("Failed to update credits")
    } finally {
      setSaving(false)
    }
  }

  async function updateUserFromModal(field: "is_active" | "is_superuser", value: boolean) {
    if (!selectedUser) return
    try {
      const token = getAdminToken()
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${selectedUser.id}?${field}=${value}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success("User updated")
        fetchUsers()
        setSelectedUser({ ...selectedUser, [field]: value })
      }
    } catch (e) {
      toast.error("Failed to update user")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] hidden md:block">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-400" />
            <h1 className="font-barlow text-xl font-bold uppercase tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleTabChange("overview")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              activeTab === "overview" 
                ? "bg-purple-900/50 text-[var(--foreground)] border border-purple-700" 
                : "text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => handleTabChange("users")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              activeTab === "users" 
                ? "bg-purple-900/50 text-[var(--foreground)] border border-purple-700" 
                : "text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            }`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button
            onClick={() => handleTabChange("resumes")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              activeTab === "resumes" 
                ? "bg-purple-900/50 text-[var(--foreground)] border border-purple-700" 
                : "text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            }`}
          >
            <FileText className="h-4 w-4" />
            Resumes
          </button>
          
          <div className="pt-4 mt-4 border-t border-[var(--border)] space-y-2">
            <Link href="/" className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition">
              <Home className="h-4 w-4" />
              Main Site
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 bg-[var(--card)]/50 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Shield className="h-4 w-4 text-purple-400" />
            <span>Admin Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[var(--foreground)] capitalize">{activeTab}</span>
          </div>
          <Button onClick={fetchStats} variant="ghost" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">System Overview</h2>
              
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-[var(--card)] border-[var(--border)]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[var(--foreground)]">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[var(--foreground)]">{stats.users}</div>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--card)] border-[var(--border)]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[var(--foreground)]">Total Resumes</CardTitle>
                    <FileText className="h-4 w-4 text-cyan-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[var(--foreground)]">{stats.resumes}</div>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--card)] border-[var(--border)]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[var(--foreground)]">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">${stats.revenue.toFixed(2)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Breakdown */}
              <Card className="bg-[var(--card)] border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--foreground)]">Resume Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(stats.status_breakdown).map(([status, count]) => (
                      <div key={status} className="bg-[var(--surface)] px-4 py-2 rounded-lg">
                        <span className="text-[var(--muted-foreground)] capitalize">{status.replace("_", " ")}: </span>
                        <span className="text-[var(--foreground)] font-bold">{count}</span>
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
              <h2 className="text-2xl font-bold text-[var(--foreground)]">User Management</h2>
              
              <Card className="bg-[var(--card)] border-[var(--border)]">
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--border)]">
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">ID</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Email</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Credits</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Resumes</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr 
                            key={user.id} 
                            className="border-b border-[var(--border)] hover:bg-[var(--surface)]/50 cursor-pointer transition"
                            onClick={() => openUserModal(user)}
                          >
                            <td className="py-3 px-4 text-[var(--foreground)]">{user.id}</td>
                            <td className="py-3 px-4 text-[var(--foreground)]">{user.email}</td>
                            <td className="py-3 px-4 text-purple-400">{user.credits}</td>
                            <td className="py-3 px-4 text-[var(--foreground)]">{user.resume_count}</td>
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
                                  onClick={(e) => { e.stopPropagation(); toggleUserActive(user.id, user.is_active); }}
                                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                >
                                  {user.is_active ? "Deactivate" : "Activate"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => { e.stopPropagation(); toggleSuperuser(user.id, user.is_superuser); }}
                                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
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
              <h2 className="text-2xl font-bold text-[var(--foreground)]">All Resumes</h2>
              
              <Card className="bg-[var(--card)] border-[var(--border)]">
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--border)]">
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">ID</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">User</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Filename</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Score</th>
                          <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumes.map((resume) => (
                          <tr key={resume.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)]/50">
                            <td className="py-3 px-4 text-[var(--foreground)]">{resume.id}</td>
                            <td className="py-3 px-4 text-[var(--foreground)]">{resume.user_email}</td>
                            <td className="py-3 px-4 text-[var(--foreground)] truncate max-w-[200px]">{resume.original_filename}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded ${
                                resume.status === "completed" ? "bg-green-900/50 text-green-400" :
                                resume.status === "failed" ? "bg-red-900/50 text-red-400" :
                                "bg-zinc-700 text-[var(--foreground)]"
                              }`}>
                                {resume.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-purple-400">{resume.score ?? "-"}</td>
                            <td className="py-3 px-4 text-[var(--muted-foreground)] text-sm">
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

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeUserModal}>
          <div 
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-[var(--foreground)] font-bold text-lg">
                    {selectedUser.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)]">User Details</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">ID: {selectedUser.id}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={closeUserModal} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 bg-[var(--surface)]/50 rounded-lg">
                <Mail className="h-5 w-5 text-[var(--muted-foreground)]" />
                <div>
                  <p className="text-xs text-zinc-500">Email</p>
                  <p className="text-[var(--foreground)] font-medium">{selectedUser.email}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-[var(--surface)]/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="text-xs text-zinc-500">Created</p>
                    <p className="text-[var(--foreground)] font-medium">
                      {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[var(--surface)]/50 rounded-lg">
                  <FileStack className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="text-xs text-zinc-500">Resumes</p>
                    <p className="text-[var(--foreground)] font-medium">{selectedUser.resume_count}</p>
                  </div>
                </div>
              </div>

              {/* Credits Editor */}
              <div className="p-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="h-5 w-5 text-purple-400" />
                  <Label className="text-purple-200 font-medium">Credits</Label>
                </div>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    value={editCredits}
                    onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                    className="bg-[var(--surface)] border-zinc-700 text-[var(--foreground)] flex-1"
                    min={0}
                  />
                  <Button 
                    onClick={saveUserCredits}
                    disabled={saving || editCredits === selectedUser.credits}
                    className="bg-purple-600 hover:bg-purple-700 text-[var(--foreground)]"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Current: {selectedUser.credits} credits</p>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--surface)]/50 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-2">Account Status</p>
                  <Button
                    variant={selectedUser.is_active ? "default" : "destructive"}
                    className={`w-full ${selectedUser.is_active ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={() => updateUserFromModal("is_active", !selectedUser.is_active)}
                  >
                    {selectedUser.is_active ? "Active" : "Inactive"}
                  </Button>
                </div>
                <div className="p-4 bg-[var(--surface)]/50 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-2">Admin Status</p>
                  <Button
                    variant={selectedUser.is_superuser ? "default" : "outline"}
                    className={`w-full ${selectedUser.is_superuser ? "bg-purple-600 hover:bg-purple-700" : "border-zinc-700 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
                    onClick={() => updateUserFromModal("is_superuser", !selectedUser.is_superuser)}
                  >
                    {selectedUser.is_superuser ? (
                      <><Shield className="h-4 w-4 mr-2" /> Admin</>
                    ) : (
                      <><ShieldOff className="h-4 w-4 mr-2" /> Not Admin</>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border)] flex justify-end">
              <Button variant="ghost" onClick={closeUserModal} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
