"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { DashboardSidebar } from "./components/DashboardSidebar"
import { DashboardHeader } from "./components/DashboardHeader"
import { OverviewTab } from "./components/OverviewTab"
import { UsersTab } from "./components/UsersTab"
import { ResumesTab } from "./components/ResumesTab"
import { UserDetailModal } from "./components/UserDetailModal"
import { Stats, User, Resume } from "./components/types"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "resumes">("overview")
  
  // User Detail Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

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
  }

  function closeUserModal() {
    setSelectedUser(null)
  }

  async function saveUserCredits(amount: number) {
    if (!selectedUser) return
    try {
      const token = getAdminToken()
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${selectedUser.id}?credits=${amount}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success("Credits updated successfully")
        fetchUsers()
        setSelectedUser({ ...selectedUser, credits: amount })
      } else {
        toast.error("Failed to update credits")
      }
    } catch (e) {
      toast.error("Failed to update credits")
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
      <DashboardSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={handleLogout} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <DashboardHeader 
          activeTab={activeTab} 
          onRefresh={fetchStats} 
        />

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto">
          {activeTab === "overview" && stats && (
            <OverviewTab stats={stats} />
          )}

          {activeTab === "users" && (
            <UsersTab 
              users={users} 
              onOpenModal={openUserModal}
              onToggleActive={toggleUserActive}
              onToggleSuperuser={toggleSuperuser}
            />
          )}

          {activeTab === "resumes" && (
            <ResumesTab resumes={resumes} />
          )}
        </div>
      </main>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={closeUserModal}
          onSaveCredits={saveUserCredits}
          onUpdateStatus={updateUserFromModal}
        />
      )}
    </div>
  )
}
