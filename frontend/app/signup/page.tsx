"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, Gift } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || "Signup failed")
      }

      const data = await res.json()
      localStorage.setItem("token", data.access_token)
      toast.success("Account created! Welcome to ResumeAI 🎉")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Gradient Orbs - Hidden in Light Mode */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-fab-blue/10 rounded-full blur-[120px] dark:opacity-100 opacity-0 transition-opacity" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-fab-red/10 rounded-full blur-[120px] dark:opacity-100 opacity-0 transition-opacity" />
      
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
          {/* Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fab-red to-fab-blue flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="font-barlow text-3xl font-bold text-[var(--foreground)] mb-2 uppercase tracking-tight">Create Account</h1>
            <p className="text-[var(--muted-foreground)]">Start transforming your resume with AI</p>
          </div>

          {/* Free Credits Badge */}
          <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-fab-red/10 to-fab-blue/10 border border-fab-red/20 flex items-center justify-center gap-2">
            <Gift className="w-4 h-4 text-fab-red" />
            <span className="text-sm text-[var(--foreground)] font-medium">Get 3 free credits on signup!</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--foreground)] text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                  className="pl-10 bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-fab-red focus:ring-fab-red/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--foreground)] text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <Input 
                  id="password" 
                  name="password" 
                  type="password"
                  placeholder="Min. 8 characters"
                  required 
                  className="pl-10 bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-fab-red focus:ring-fab-red/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[var(--foreground)] text-sm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password"
                  placeholder="••••••••"
                  required 
                  className="pl-10 bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-fab-red focus:ring-fab-red/20"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-fab-red hover:bg-fab-red/90 text-white font-barlow font-bold text-lg uppercase tracking-wider py-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">
              Already have an account?{" "}
              <Link href="/login" className="text-fab-red hover:text-fab-red/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
