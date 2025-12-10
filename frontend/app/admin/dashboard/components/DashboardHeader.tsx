
import { Shield, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  activeTab: string
  onRefresh: () => void
}

export function DashboardHeader({ activeTab, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 bg-[var(--card)]/50 backdrop-blur">
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Shield className="h-4 w-4 text-purple-400" />
        <span>Admin Dashboard</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[var(--foreground)] capitalize">{activeTab}</span>
      </div>
      <Button onClick={onRefresh} variant="ghost" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </header>
  )
}
