"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, User } from "lucide-react"
import { NoiseBackground, GlassCard } from "@/components/ui/background"

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
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4 relative overflow-hidden">
      <NoiseBackground />
      
      {/* Back to Home */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors z-20"
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
        <GlassCard className="p-8" hover={false}>
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-zinc-400">Start transforming your resume with AI</p>
          </div>

          {/* Free Credits Badge */}
          <div className="mb-6 p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 text-center">
            <span className="text-sm text-cyan-400">🎁 Get 3 free credits on signup!</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200 text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200 text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  id="password" 
                  name="password" 
                  type="password"
                  placeholder="Min. 8 characters"
                  required 
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-200 text-sm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password"
                  placeholder="••••••••"
                  required 
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold py-6"
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
            <p className="text-sm text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
