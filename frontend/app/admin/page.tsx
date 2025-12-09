"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Shield, Loader2, Lock, ArrowLeft, Mail } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // First, authenticate with normal login
      const loginRes = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password })
      })

      if (!loginRes.ok) {
        toast.error("Invalid credentials")
        setLoading(false)
        return
      }

      const loginData = await loginRes.json()
      const token = loginData.access_token

      // Verify admin status
      const verifyRes = await fetch("http://localhost:8000/api/v1/admin/verify", {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (!verifyRes.ok) {
        toast.error("Access denied. Admin privileges required.")
        setLoading(false)
        return
      }

      const adminData = await verifyRes.json()
      
      if (!adminData.is_admin) {
        toast.error("Access denied. You are not authorized to access admin panel.")
        setLoading(false)
        return
      }

      // Store admin-specific token
      localStorage.setItem("admin_token", token)
      localStorage.setItem("admin_verified", "true")
      
      toast.success("Welcome, Admin!")
      router.push("/admin/dashboard")
      
    } catch (e) {
      toast.error("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Gradient Orbs - Hidden in Light Mode */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] dark:opacity-100 opacity-0 transition-opacity" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] dark:opacity-100 opacity-0 transition-opacity" />
      
      {/* Back to Home */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-barlow text-3xl font-bold text-[var(--foreground)] uppercase tracking-tight">Admin Access</h1>
            <p className="text-[var(--muted-foreground)] mt-2">
              Restricted area. Authorized personnel only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--foreground)] text-sm">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--foreground)] text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-barlow font-bold text-lg uppercase tracking-wider py-6"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lock className="h-4 w-4 mr-2" />
              )}
              Access Admin Panel
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--muted-foreground)]">
              🔒 This login is monitored. Unauthorized access attempts will be logged.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
