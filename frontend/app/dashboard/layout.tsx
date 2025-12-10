"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { 
  FileText, Settings, Coins, LogOut, Home, Sparkles, 
  ChevronRight, User, Zap, Menu, X
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to access the dashboard")
      router.push("/login")
    } else {
      setAuthorized(true)
      fetchUser(token)
    }
  }, [router])

  async function fetchUser(token: string) {
    try {
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

  async function handleBuyCredits() {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/api/v1/payments/create-checkout-session", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        window.location.href = data.url
      } else {
        toast.error("Failed to initiate checkout")
      }
    } catch (e) {
      toast.error("Error connecting to payment server")
    }
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-fab-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const navItems = [
    { href: "/dashboard", label: "My Resumes", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fab-red/5 rounded-full blur-[150px] dark:opacity-100 opacity-0" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fab-blue/5 rounded-full blur-[150px] dark:opacity-100 opacity-0" />
      </div>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--card)]/80 backdrop-blur-xl border-b border-[var(--border)] z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fab-red to-fab-blue flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-barlow font-bold uppercase tracking-tight">ResumeAI</span>
        </Link>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed inset-0 top-16 bg-[var(--background)]/95 backdrop-blur-xl z-40 p-4"
        >
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive(item.href)
                    ? "bg-[var(--surface)] text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}

      <div className="flex min-h-screen pt-16 md:pt-0">
        {/* Sidebar */}
        <aside className="w-72 border-r border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-xl hidden md:flex flex-col fixed left-0 top-0 h-full z-40">
          {/* Logo */}
          <div className="p-6 border-b border-[var(--border)]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fab-red to-fab-blue flex items-center justify-center shadow-lg shadow-fab-red/20 group-hover:shadow-fab-red/40 transition-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-barlow text-xl font-bold uppercase tracking-tight text-[var(--foreground)]">
                  ResumeAI
                </h1>
                <p className="text-[10px] font-pixel text-[var(--muted-foreground)] tracking-wider">DASHBOARD</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 mx-4 mt-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                  {user?.email || "Loading..."}
                </p>
                <div className="flex items-center gap-1 text-emerald-500">
                  <Coins className="w-3 h-3" />
                  <span className="text-xs font-bold">{user?.credits ?? "..."} credits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 flex-1">
            <p className="text-[10px] font-pixel text-[var(--muted-foreground)] tracking-wider uppercase px-3 mb-3">Menu</p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition group ${
                  isActive(item.href)
                    ? "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive(item.href) ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
              </Link>
            ))}
          </nav>

          {/* Credits CTA */}
          <div className="p-4 mx-4 mb-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-fab-red/10 to-fab-blue/10 border border-fab-red/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-fab-red" />
                <span className="text-sm font-medium text-[var(--foreground)]">Need more credits?</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mb-3">
                Get 5 credits to enhance more resumes
              </p>
              <Button 
                onClick={handleBuyCredits}
                className="w-full bg-gradient-to-r from-fab-red to-fab-blue hover:opacity-90 text-white font-barlow font-bold uppercase tracking-wider text-sm"
              >
                Buy Credits - $20
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="p-4 border-t border-[var(--border)] space-y-1">
            <Link 
              href="/"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition text-sm"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token")
                router.push("/login")
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-500 transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-72 min-h-screen">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
