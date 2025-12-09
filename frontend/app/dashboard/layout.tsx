"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { FileText, PlusCircle, Settings, Coins, LogOut, Home, Sparkles } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [user, setUser] = useState<any>(null)

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
              window.location.href = data.url // Redirect to Stripe
          } else {
              toast.error("Failed to initiate checkout")
          }
      } catch (e) {
          toast.error("Error connecting to payment server")
      }
  }

  if (!authorized) {
    return null // or a loading spinner
  }

  // Check for success param from Stripe redirect
  if (typeof window !== 'undefined' && window.location.search.includes("success=true")) {
      // Ideally show a toast only once, but simple check works for MVP
      // toast.success("Credits added!") 
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fab-red to-fab-blue flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-barlow text-xl font-bold uppercase tracking-tight text-[var(--foreground)]">
              ResumeAI
            </h1>
          </Link>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] font-medium transition hover:bg-[var(--surface-hover)]"
          >
            <FileText className="w-4 h-4" />
            My Resumes
          </Link>
          
          
          <div className="pt-4 mt-4 border-t border-[var(--border)] space-y-2">
            <Link 
              href="/dashboard/settings" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <Button 
              onClick={handleBuyCredits} 
              className="w-full bg-gradient-to-r from-fab-red to-fab-blue hover:opacity-90 text-white font-barlow font-bold uppercase tracking-wider"
            >
              <Coins className="w-4 h-4 mr-2" />
              Buy 5 Credits ($20)
            </Button>
          </div>
        </nav>

        {/* Bottom Links */}
        <div className="p-4 border-t border-[var(--border)]">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 bg-[var(--card)] backdrop-blur">
          <div className="flex items-center gap-3 text-sm">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-500" />
              <span className="text-[var(--muted-foreground)]">Credits:</span>
              <span className="text-emerald-500 font-bold text-lg">{user?.credits ?? "..."}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => {
              localStorage.removeItem("token")
              router.push("/login")
            }}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto bg-[var(--background)]">
          {children}
        </div>
      </main>
    </div>
  )
}
