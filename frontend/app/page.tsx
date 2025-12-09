import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, FileText, Sparkles, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="border-b border-zinc-800/50 backdrop-blur-sm fixed w-full z-50 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            ResumeRefine AI
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles className="h-4 w-4" />
          <span>Powered by Advanced AI Models</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700">
          Transform Your Resume <br />
          <span className="text-indigo-500">Into a Job Offer.</span>
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
          Upload your resume and let our AI analyze, scorecard, and rewrite it to perfection. 
          Stand out from the crowd with quantifiable results and professional formatting.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200">
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg shadow-indigo-500/20 w-full sm:w-auto">
              Start Refining Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-full w-full sm:w-auto">
              How it Works
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats / Trust */}
      <section className="py-10 border-y border-zinc-900 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div>
                <div className="text-3xl font-bold text-white mb-1">10k+</div>
                <div className="text-sm text-zinc-500">Resumes Analyzed</div>
             </div>
             <div>
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-sm text-zinc-500">Interview Rate</div>
             </div>
             <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-zinc-500">AI Availability</div>
             </div>
             <div>
                <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-sm text-zinc-500">User Rating</div>
             </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Everything you need to get hired</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FileText className="h-8 w-8 text-indigo-400" />}
            title="Smart Analysis"
            description="Our AI scans your resume for 30+ critical ATS checkpoints and identifies exactly what's holding you back."
          />
          <FeatureCard 
            icon={<Zap className="h-8 w-8 text-cyan-400" />}
            title="Instant Rewrite"
            description="Don't just fix typos. Our engine completely rewrites your bullet points to be action-oriented and result-driven."
          />
          <FeatureCard 
            icon={<CheckCircle className="h-8 w-8 text-green-400" />}
            title="Professional Export"
            description="Download your polished resume in a perfectly formatted PDF that looks great on any screen or paper."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 text-center text-zinc-500 text-sm">
        <p>&copy; 2024 ResumeRefine AI. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition hover:bg-zinc-900">
      <div className="mb-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-zinc-100">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}
