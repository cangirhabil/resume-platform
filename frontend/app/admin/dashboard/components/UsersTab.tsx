
import { Loader2, Shield, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "./types"

interface UsersTabProps {
  users: User[]
  onOpenModal: (user: User) => void
  onToggleActive: (userId: number, currentStatus: boolean) => void
  onToggleSuperuser: (userId: number, currentStatus: boolean) => void
}

export function UsersTab({ users, onOpenModal, onToggleActive, onToggleSuperuser }: UsersTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">User Management</h2>
      
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Credits</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Resumes</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="border-b border-[var(--border)] hover:bg-[var(--surface)]/50 cursor-pointer transition"
                    onClick={() => onOpenModal(user)}
                  >
                    <td className="py-3 px-4 text-[var(--foreground)]">{user.id}</td>
                    <td className="py-3 px-4 text-[var(--foreground)]">{user.email}</td>
                    <td className="py-3 px-4 text-purple-400">{user.credits}</td>
                    <td className="py-3 px-4 text-[var(--foreground)]">{user.resume_count}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {user.is_superuser && (
                          <span className="px-2 py-1 text-xs rounded bg-purple-900/50 text-purple-400">Admin</span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded ${user.is_active ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); onToggleActive(user.id, user.is_active); }}
                          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        >
                          {user.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); onToggleSuperuser(user.id, user.is_superuser); }}
                          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                          title={user.is_superuser ? "Remove admin" : "Make admin"}
                        >
                          {user.is_superuser ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                Loading users...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
