"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden md:block">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            ResumeAI
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition">
            My Resumes
          </Link>
          <Link href="/dashboard/new" className="block px-4 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition">
            New Resume
          </Link>
          <div className="pt-4 mt-4 border-t border-zinc-800">
             <Button onClick={handleBuyCredits} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                 Buy 5 Credits ($20)
             </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur">
          <div className="text-sm text-zinc-400">
            Credits: <span className="text-indigo-400 font-bold text-lg">{user?.credits ?? "..."}</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => {
              localStorage.removeItem("token")
              router.push("/login")
            }}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            Sign Out
          </Button>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
