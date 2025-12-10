
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Resume } from "./types"

interface ResumesTabProps {
  resumes: Resume[]
}

export function ResumesTab({ resumes }: ResumesTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">All Resumes</h2>
      
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">User</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Filename</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Score</th>
                  <th className="text-left py-3 px-4 text-[var(--muted-foreground)] font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume) => (
                  <tr key={resume.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)]/50">
                    <td className="py-3 px-4 text-[var(--foreground)]">{resume.id}</td>
                    <td className="py-3 px-4 text-[var(--foreground)]">{resume.user_email}</td>
                    <td className="py-3 px-4 text-[var(--foreground)] truncate max-w-[200px]">{resume.original_filename}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        resume.status === "completed" ? "bg-green-900/50 text-green-400" :
                        resume.status === "failed" ? "bg-red-900/50 text-red-400" :
                        "bg-zinc-700 text-[var(--foreground)]"
                      }`}>
                        {resume.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-purple-400">{resume.score ?? "-"}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)] text-sm">
                      {resume.created_at ? new Date(resume.created_at).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {resumes.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                Loading resumes...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
