"use client"

import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Upload, 
  Brain, 
  Sparkles, 
  FileCheck,
  CheckCircle2,
  TrendingUp,
  FileText,
  Target
} from "lucide-react"
import Link from "next/link"

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 bg-[var(--background)] transition-colors duration-300">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent opacity-50 blur-[100px] dark:from-purple-900/20" />
        <div className="absolute bottom-0 inset-x-0 h-[500px] bg-gradient-to-t from-blue-900/5 to-transparent opacity-30 blur-[100px] dark:from-blue-900/10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      </div>

      <div className="container px-4 text-center z-10 flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] backdrop-blur-sm mb-8 hover:bg-[var(--surface-hover)] transition-colors"
        >
          <Brain className="w-3 h-3 text-fab-red" />
          <span className="font-pixel text-xs text-[var(--muted-foreground)] tracking-wider">AI-POWERED RESUME OPTIMIZATION</span>
        </motion.div>

        {/* Massive Typography */}
        <h1 className="font-barlow font-bold text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] leading-[0.9] sm:leading-[0.85] tracking-tighter text-[var(--foreground)] mb-6 sm:mb-8 uppercase transition-colors duration-300">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "circOut" }}>
            Resume
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
            className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-400 to-zinc-800 dark:from-zinc-200 dark:to-zinc-600"
          >
            Refined
          </motion.div>
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-[var(--muted-foreground)] mb-12 font-sans font-light tracking-wide"
        >
          Craft your professional legacy with <span className="text-[var(--foreground)] font-medium">intelligent agents</span>.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link href="/signup" className="group relative px-8 py-4 bg-fab-red text-white font-barlow font-bold text-xl uppercase tracking-wider rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(252,73,76,0.5)]">
            <span className="flex items-center gap-2">
              Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link href="#process" className="px-8 py-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-barlow font-semibold text-xl uppercase tracking-wider transition-colors">
            See How It Works
          </Link>
        </motion.div>
      </div>

      {/* System Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, rotateX: 15, y: 100 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ delay: 0.8, duration: 1.2, ease: "circOut" }}
        className="mt-24 relative z-20 perspective-1000 w-full max-w-6xl mx-auto px-4"
      >
        <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden transform-gpu preserve-3d">
          {/* Header Bar */}
          <div className="h-12 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-pixel text-[10px] text-[var(--muted-foreground)]">ResumeAI Dashboard</span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-pixel text-[9px] text-green-500">LIVE</span>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[480px] bg-[var(--background)] overflow-y-auto lg:overflow-visible">
            
            {/* Left Sidebar - Process Steps */}
            <div className="lg:col-span-3 space-y-3 flex lg:block overflow-x-auto lg:overflow-visible gap-3 pb-2 lg:pb-0">
              <div className="font-pixel text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest mb-4">Workflow</div>
              
              {[
                { icon: Upload, label: "Upload CV", status: "complete", color: "#10b981" },
                { icon: Brain, label: "AI Analysis", status: "complete", color: "#10b981" },
                { icon: Sparkles, label: "Optimize", status: "active", color: "#fc494c" },
                { icon: FileCheck, label: "Export", status: "pending", color: "#71717a" }
              ].map((step, i) => (
                <motion.div 
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    step.status === "active" 
                      ? "bg-fab-red/10 border-fab-red/30" 
                      : step.status === "complete"
                      ? "bg-[var(--surface)] border-[var(--border)]"
                      : "bg-[var(--surface)]/50 border-[var(--border)] opacity-50"
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    {step.status === "complete" ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: step.color }} />
                    ) : (
                      <step.icon className="w-4 h-4" style={{ color: step.color }} />
                    )}
                  </div>
                  <span className={`font-sans text-sm ${step.status === "active" ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Center - Resume Preview */}
            <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="h-full rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-5 overflow-hidden relative"
              >
                {/* Resume Header */}
                <div className="mb-4">
                  <div className="h-3 w-32 bg-[var(--foreground)]/10 rounded mb-2" />
                  <div className="h-2 w-48 bg-[var(--foreground)]/5 rounded" />
                </div>
                
                {/* Resume Sections */}
                <div className="space-y-4">
                  <div>
                    <div className="h-2 w-20 bg-fab-blue/30 rounded mb-2" />
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-[var(--foreground)]/5 rounded" />
                      <div className="h-1.5 w-4/5 bg-[var(--foreground)]/5 rounded" />
                      <div className="h-1.5 w-3/5 bg-[var(--foreground)]/5 rounded" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="h-2 w-24 bg-purple-500/30 rounded mb-2" />
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-[var(--foreground)]/5 rounded" />
                      <div className="h-1.5 w-5/6 bg-[var(--foreground)]/5 rounded" />
                    </div>
                  </div>

                  <div>
                    <div className="h-2 w-16 bg-fab-red/30 rounded mb-2" />
                    <div className="flex flex-wrap gap-1.5">
                      {["Python", "React", "AI/ML", "AWS"].map((skill) => (
                        <div key={skill} className="px-2 py-0.5 rounded bg-[var(--foreground)]/5 text-[8px] font-mono text-[var(--muted-foreground)]">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Optimization Highlight */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                  className="absolute inset-0 border-2 border-fab-red/50 rounded-xl pointer-events-none"
                />
                
                {/* AI Annotation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-fab-red text-white text-[10px] font-pixel flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  ENHANCING...
                </motion.div>
              </motion.div>
            </div>

            {/* Right Panel - Stats & Insights */}
            <div className="lg:col-span-4 space-y-4">
              {/* ATS Score Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-pixel text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest">ATS Score</span>
                  <Target className="w-4 h-4 text-fab-blue" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-barlow font-bold text-5xl text-[var(--foreground)]">94</span>
                  <span className="font-barlow text-xl text-[var(--muted-foreground)] mb-1">%</span>
                  <div className="flex items-center gap-1 ml-2 mb-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] font-mono text-green-500">+18%</span>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full bg-[var(--foreground)]/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "94%" }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="h-full bg-gradient-to-r from-fab-red to-fab-blue rounded-full"
                  />
                </div>
              </motion.div>

              {/* Keyword Matches */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-pixel text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest">Keywords Found</span>
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Technical Skills", count: 12, color: "#0099ff" },
                    { label: "Soft Skills", count: 8, color: "#a855f7" },
                    { label: "Industry Terms", count: 15, color: "#10b981" }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-xs text-[var(--muted-foreground)]">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[var(--foreground)]/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: `${item.count * 5}%` }}
                            transition={{ delay: 1.7, duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                        <span className="text-xs font-mono text-[var(--foreground)] w-6 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 }}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mb-3">
                  <Sparkles className="w-3 h-3 text-fab-red" />
                  AI Suggestions Applied
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Added metrics", "Improved verbs", "Fixed format", "Keywords +8"].map((item) => (
                    <div key={item} className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-[9px] font-mono text-green-500">
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Glow Reflection */}
        <div className="absolute -bottom-20 inset-x-0 h-64 bg-fab-red/20 blur-[150px] -z-10 rounded-full mix-blend-screen dark:mix-blend-normal" />
      </motion.div>
    </section>
  )
}
