"use client"

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { 
  Upload, 
  Brain, 
  Sparkles, 
  FileCheck, 
  ArrowDown,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: 1,
    keyword: "UPLOAD",
    title: "Your Resume",
    description: "Drag & drop or browse for your existing resume. We support PDF, DOCX, and TXT formats.",
    icon: Upload,
    color: "#fc494c",
    features: ["Multi-format support", "Instant parsing", "Secure & encrypted"]
  },
  {
    id: 2,
    keyword: "ANALYZE",
    title: "Deep AI Scan",
    description: "Our AI agents analyze your resume against 10,000+ job descriptions to identify gaps and opportunities.",
    icon: Brain,
    color: "#0099ff",
    features: ["ATS Compatibility Score", "Keyword Gap Analysis", "Industry Benchmarking"]
  },
  {
    id: 3,
    keyword: "OPTIMIZE",
    title: "Smart Rewrite",
    description: "One-click enhancement that rewrites your bullet points and injects high-impact keywords.",
    icon: Sparkles,
    color: "#a855f7",
    features: ["AI-Powered Rewriting", "Skill Highlighting", "Impact Maximization"]
  },
  {
    id: 4,
    keyword: "EXPORT",
    title: "Download Ready",
    description: "Download your polished resume in professional formats, ready to submit to any job application.",
    icon: FileCheck,
    color: "#10b981",
    features: ["PDF & DOCX Export", "ATS-Friendly Layout", "Multiple Templates"]
  }
]

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const stepIndex = Math.min(Math.floor(latest * steps.length), steps.length - 1)
    setActiveStep(stepIndex)
  })

  return (
    <section id="process" ref={containerRef} className="relative bg-[var(--background)] transition-colors duration-300">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          {/* Dynamic Glow based on active step */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 dark:opacity-20 light:opacity-10"
            animate={{ backgroundColor: steps[activeStep]?.color || "#fc494c" }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              {/* Section Label */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-12 bg-fab-red" />
                <span className="font-pixel text-fab-red text-sm tracking-widest uppercase">How It Works</span>
              </motion.div>

              {/* Main Title */}
              <div className="space-y-2">
                <h2 className="font-barlow font-bold text-6xl md:text-7xl lg:text-8xl text-[var(--foreground)] uppercase leading-[0.85] tracking-tighter">
                  {steps.map((step, i) => (
                    <motion.span
                      key={step.id}
                      className="block"
                      animate={{
                        opacity: activeStep === i ? 1 : 0.2,
                        x: activeStep === i ? 0 : -20,
                        color: activeStep === i ? step.color : "var(--muted-foreground)"
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {step.keyword}.
                    </motion.span>
                  ))}
                </h2>
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-2">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.id}
                    className="h-1 rounded-full"
                    animate={{
                      width: activeStep === i ? 48 : 16,
                      backgroundColor: activeStep >= i ? step.color : "var(--border)"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>

              {/* Scroll Hint */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: activeStep < steps.length - 1 ? 0.5 : 0 }}
                className="flex items-center gap-2 text-[var(--muted-foreground)] font-sans text-sm"
              >
                <ArrowDown className="w-4 h-4 animate-bounce" />
                Scroll to explore
              </motion.div>
            </div>

            {/* Right Side - Active Step Card */}
            <div className="relative h-[500px]">
              {steps.map((step, i) => (
                <StepCard key={step.id} step={step} isActive={activeStep === i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for scroll */}
      <div className="h-[300vh]" />
    </section>
  )
}

function StepCard({ step, isActive }: { step: typeof steps[0], isActive: boolean }) {
  const Icon = step.icon

  return (
    <motion.div
      className="absolute inset-0 p-8 rounded-3xl border bg-[var(--surface)]/80 backdrop-blur-xl overflow-hidden shadow-2xl"
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.9,
        y: isActive ? 0 : 30,
        borderColor: isActive ? `${step.color}30` : "var(--border)"
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ pointerEvents: isActive ? "auto" : "none" }}
    >
      {/* Top Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-full"
        style={{ backgroundColor: step.color }}
      />

      {/* Step Number */}
      <div className="flex items-center justify-between mb-8">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center border border-[var(--border)]"
          style={{ backgroundColor: `${step.color}15` }}
        >
          <Icon className="w-8 h-8" style={{ color: step.color }} />
        </div>
        <span className="font-pixel text-xs tracking-widest text-[var(--muted-foreground)]">STEP 0{step.id}</span>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div>
          <h3 className="font-barlow font-bold text-4xl md:text-5xl text-[var(--foreground)] uppercase leading-none mb-2">
            {step.keyword}
          </h3>
          <p className="font-barlow text-xl text-[var(--muted-foreground)]">{step.title}</p>
        </div>

        <p className="font-sans text-[var(--muted-foreground)] text-lg leading-relaxed">
          {step.description}
        </p>

        {/* Features List */}
        <div className="pt-4 border-t border-[var(--border)]">
          <p className="font-pixel text-xs text-[var(--muted-foreground)] uppercase tracking-widest mb-4">Included</p>
          <ul className="space-y-3">
            {step.features.map((feature, i) => (
              <motion.li 
                key={feature}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 10 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-[var(--foreground)] font-sans"
              >
                <CheckCircle2 className="w-5 h-5" style={{ color: step.color }} />
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Background Decoration */}
      <div 
        className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-10 dark:opacity-20"
        style={{ backgroundColor: step.color }}
      />
    </motion.div>
  )
}
