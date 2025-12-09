"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Need to create or add input
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function ResumeDetailPage() {
  const params = useParams()
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [resume, setResume] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    fetchResume()
  }, [id])

  async function fetchResume() {
     try {
       const token = localStorage.getItem("token")
       // Polling logic would go here nicely
       // For now just fetch once
       const res = await fetch(`http://localhost:8000/api/v1/resumes/${id}`, {
         headers: { "Authorization": `Bearer ${token}` }
       })
       if (!res.ok) throw new Error("Failed")
       const data = await res.json()
       setResume(data)
       setLoading(false)
       
       if (data.status === "uploaded") {
         triggerAnalysis()
       }
     } catch (e) {
       toast.error("Error loading resume")
       setLoading(false)
     }
  }

  async function triggerAnalysis() {
    try {
      const token = localStorage.getItem("token")
      await fetch(`http://localhost:8000/api/v1/resumes/${id}/analyze`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
      toast.info("Analysis started...")
      // In real app, start polling
    } catch (e) {
      toast.error("Failed to start analysis")
    }
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Resume Analysis</h2>
         <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-zinc-800 text-sm text-zinc-300">
                Status: {resume?.status}
             </div>
             {resume?.status === "completed" && (
                 <a 
                   href={`http://localhost:8000/api/v1/resumes/${id}/download?token=${localStorage.getItem("token")}`} // Ideally handle download with fetch + blob for auth
                   target="_blank"
                 >
                     <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                         <CheckCircle className="h-4 w-4" />
                         Download PDF
                     </Button>
                 </a>
             )}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Original / Issues */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
             <CardHeader>
               <CardTitle className="text-white">Analysis Report</CardTitle>
               <CardDescription>Score: <span className="text-indigo-400 font-bold">{resume?.analysis_result?.score || "N/A"}</span>/100</CardDescription>
             </CardHeader>
             <CardContent className="text-zinc-300 space-y-4">
                {resume?.status === "analyzing" ? (
                  <div className="flex flex-col items-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-indigo-500 mb-2"/>
                    <p>Analyzing document structure and content...</p>
                  </div>
                ) : resume?.analysis_result ? (
                  <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-white mb-2">Summary</h4>
                        <p className="text-sm text-zinc-400">{resume.analysis_result.summary}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-2">Critical Issues</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-amber-400/80">
                            {resume.analysis_result.issues?.map((issue: string, i: number) => (
                                <li key={i}>{issue}</li>
                            ))}
                        </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>Waiting for analysis...</p>
                  </div>
                )}
             </CardContent>
          </Card>
        </div>

        {/* Right Col: Clarification Questions */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-indigo-500">
             <CardHeader>
               <CardTitle className="text-white">Clarification Needed</CardTitle>
               <CardDescription>Please answer to help us improve your resume.</CardDescription>
             </CardHeader>
             <CardContent>
                {!resume?.analysis_result?.clarification_questions ? (
                     <p className="text-zinc-400 italic">Questions will appear here shortly.</p>
                ) : (
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const answers: Record<string, string> = {}
                        resume.analysis_result.clarification_questions.forEach((q: string) => {
                            answers[q] = formData.get(q) as string
                        })
                        
                        // Submit
                         const token = localStorage.getItem("token")
                         fetch(`http://localhost:8000/api/v1/resumes/${id}/rewrite`, {
                            method: "POST",
                            headers: { 
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(answers)
                         })
                         .then(res => {
                             if(res.ok) toast.success("Rewriting resume...")
                             else toast.error("Failed to start rewrite")
                         })
                    }}>
                        {resume.analysis_result.clarification_questions.map((q: string, i: number) => (
                            <div key={i} className="space-y-2">
                                <Label htmlFor={q} className="text-zinc-200">{q}</Label>
                                <Textarea id={q} name={q} placeholder="Type your answer here..." className="bg-zinc-800 border-zinc-700 text-white"/>
                            </div>
                        ))}
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Submit and Rewrite</Button>
                    </form>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
