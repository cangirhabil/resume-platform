
import { Shield, LayoutDashboard, Users, FileText, Home, LogOut } from "lucide-react"
import Link from "next/link"

interface DashboardSidebarProps {
  activeTab: "overview" | "users" | "resumes"
  onTabChange: (tab: "overview" | "users" | "resumes") => void
  onLogout: () => void
}

export function DashboardSidebar({ activeTab, onTabChange, onLogout }: DashboardSidebarProps) {
  return (
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
          onClick={() => onTabChange("overview")}
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
          onClick={() => onTabChange("users")}
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
          onClick={() => onTabChange("resumes")}
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
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  )
}
