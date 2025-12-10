
import { useState } from "react"
import { Loader2, X, Mail, Calendar, FileStack, Coins, Save, Shield, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "./types"

interface UserDetailModalProps {
  user: User
  onClose: () => void
  onSaveCredits: (amount: number) => Promise<void>
  onUpdateStatus: (field: "is_active" | "is_superuser", value: boolean) => Promise<void>
}

export function UserDetailModal({ user, onClose, onSaveCredits, onUpdateStatus }: UserDetailModalProps) {
  const [editCredits, setEditCredits] = useState<number>(user.credits)
  const [saving, setSaving] = useState(false)

  const handleSaveCredits = async () => {
    setSaving(true)
    await onSaveCredits(editCredits)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-[var(--foreground)] font-bold text-lg">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">User Details</h3>
              <p className="text-[var(--muted-foreground)] text-sm">ID: {user.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Email */}
          <div className="flex items-center gap-3 p-3 bg-[var(--surface)]/50 rounded-lg">
            <Mail className="h-5 w-5 text-[var(--muted-foreground)]" />
            <div>
              <p className="text-xs text-zinc-500">Email</p>
              <p className="text-[var(--foreground)] font-medium">{user.email}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-[var(--surface)]/50 rounded-lg">
              <Calendar className="h-5 w-5 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-xs text-zinc-500">Created</p>
                <p className="text-[var(--foreground)] font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[var(--surface)]/50 rounded-lg">
              <FileStack className="h-5 w-5 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-xs text-zinc-500">Resumes</p>
                <p className="text-[var(--foreground)] font-medium">{user.resume_count}</p>
              </div>
            </div>
          </div>

          {/* Credits Editor */}
          <div className="p-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="h-5 w-5 text-purple-400" />
              <Label className="text-purple-200 font-medium">Credits</Label>
            </div>
            <div className="flex gap-3">
              <Input
                type="number"
                value={editCredits}
                onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                className="bg-[var(--surface)] border-zinc-700 text-[var(--foreground)] flex-1"
                min={0}
              />
              <Button 
                onClick={handleSaveCredits}
                disabled={saving || editCredits === user.credits}
                className="bg-purple-600 hover:bg-purple-700 text-[var(--foreground)]"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">Current: {user.credits} credits</p>
          </div>

          {/* Status Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--surface)]/50 rounded-lg">
              <p className="text-xs text-zinc-500 mb-2">Account Status</p>
              <Button
                variant={user.is_active ? "default" : "destructive"}
                className={`w-full ${user.is_active ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => onUpdateStatus("is_active", !user.is_active)}
              >
                {user.is_active ? "Active" : "Inactive"}
              </Button>
            </div>
            <div className="p-4 bg-[var(--surface)]/50 rounded-lg">
              <p className="text-xs text-zinc-500 mb-2">Admin Status</p>
              <Button
                variant={user.is_superuser ? "default" : "outline"}
                className={`w-full ${user.is_superuser ? "bg-purple-600 hover:bg-purple-700" : "border-zinc-700 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
                onClick={() => onUpdateStatus("is_superuser", !user.is_superuser)}
              >
                {user.is_superuser ? (
                  <><Shield className="h-4 w-4 mr-2" /> Admin</>
                ) : (
                  <><ShieldOff className="h-4 w-4 mr-2" /> Not Admin</>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border)] flex justify-end">
          <Button variant="ghost" onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
