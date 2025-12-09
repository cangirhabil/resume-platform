"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Shield, Loader2, Lock } from "lucide-react"

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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-zinc-950 to-pink-900/20" />
      
      <Card className="w-full max-w-md bg-zinc-900/80 border-zinc-800 backdrop-blur relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
          <CardDescription className="text-zinc-400">
            Restricted area. Authorized personnel only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lock className="h-4 w-4 mr-2" />
              )}
              Access Admin Panel
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <p className="text-xs text-zinc-500">
              🔒 This login is monitored. Unauthorized access attempts will be logged.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
