
import { Users, FileText, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stats } from "./types"

interface OverviewTabProps {
  stats: Stats
}

export function OverviewTab({ stats }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">System Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--foreground)]">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--foreground)]">{stats.users}</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--foreground)]">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--foreground)]">{stats.resumes}</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--foreground)]">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">${stats.revenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">Resume Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(stats.status_breakdown).map(([status, count]) => (
              <div key={status} className="bg-[var(--surface)] px-4 py-2 rounded-lg">
                <span className="text-[var(--muted-foreground)] capitalize">{status.replace("_", " ")}: </span>
                <span className="text-[var(--foreground)] font-bold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
