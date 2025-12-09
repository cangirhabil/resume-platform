import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">My Resumes</h2>
          <p className="text-zinc-400">Manage and optimize your professional documents.</p>
        </div>
        <Link href="/dashboard/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Empty State / Demo Card */}
        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">
              Software Engineer Resume
            </CardTitle>
            <FileText className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">85% Score</div>
            <p className="text-xs text-zinc-500 mt-1">
              Last updated 2 hours ago
            </p>
          </CardContent>
        </Card>

        {/* Placeholder for 'New' if empty */}
        <Link href="/dashboard/new" className="border-dashed border-2 border-zinc-800 rounded-xl flex flex-col items-center justify-center p-8 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition group">
          <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition">
            <PlusCircle className="h-6 w-6 text-zinc-500 group-hover:text-indigo-400" />
          </div>
          <p className="text-zinc-400 font-medium group-hover:text-indigo-300">Upload New Resume</p>
        </Link>
      </div>
    </div>
  )
}
