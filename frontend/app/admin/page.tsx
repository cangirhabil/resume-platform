"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats() // This endpoint needs to be created
  }, [])

  async function fetchStats() {
     // Mocking stats for now as we haven't built the admin endpoint yet
     // Ideally fetch from /api/v1/admin/stats
     setTimeout(() => {
         setStats({
             users: 12,
             resumes: 45,
             revenue: 240
         })
         setLoading(false)
     }, 1000)
  }

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-white"/></div>

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.users}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">Total Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.resumes}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${stats.revenue}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
