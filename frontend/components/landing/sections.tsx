"use client"

import { motion } from "framer-motion"
import { 
  Sparkles, Code2, Palette, Cloud, Bot, Zap,
  FileText, Target, Upload, Download
} from "lucide-react"
import { GlassCard } from "@/components/ui/background"

const features = [
  {
    icon: Upload,
    title: "Smart Upload",
    description: "Drag & drop your PDF or Word resume. Our AI instantly begins analysis.",
    color: "cyan",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Bot,
    title: "AI Analysis",
    description: "Deep analysis identifies gaps, weak language, and missing keywords.",
    color: "violet",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description: "Score 95%+ on Applicant Tracking Systems with optimized keywords.",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "AI Rewrite",
    description: "Transform weak bullet points into powerful achievement statements.",
    color: "pink",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Download,
    title: "Export Ready",
    description: "Download in PDF and Word formats with professional formatting.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get your enhanced resume in minutes, not hours or days.",
    color: "cyan",
    gradient: "from-cyan-500 to-violet-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="section-container">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="gradient-text">Powerful</span>{" "}
            <span className="text-white">Features</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Everything you need to create a standout, ATS-optimized resume that gets interviews.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard 
                className="p-6 h-full group cursor-pointer"
                glowColor={feature.color as any}
              >
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl mb-4 flex items-center justify-center
                  bg-gradient-to-br ${feature.gradient}
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>

                {/* Background Icon */}
                <feature.icon className="absolute bottom-4 right-4 w-24 h-24 text-white/5 -z-10" />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const processSteps = [
  {
    step: "01",
    title: "Upload",
    description: "Upload your existing resume in PDF or Word format.",
    icon: Upload,
  },
  {
    step: "02",
    title: "Analyze",
    description: "AI scans for gaps, weak language, and ATS compatibility.",
    icon: Bot,
  },
  {
    step: "03",
    title: "Enhance",
    description: "Answer questions and watch AI transform your resume.",
    icon: Sparkles,
  },
  {
    step: "04",
    title: "Download",
    description: "Get your optimized resume in PDF and Word formats.",
    icon: Download,
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="py-24 relative overflow-hidden">
      {/* Code Rain Background Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-500 font-mono text-xs whitespace-nowrap"
            initial={{ y: -100, x: `${i * 5}%`, opacity: 0 }}
            animate={{ 
              y: "100vh", 
              opacity: [0, 0.5, 0.5, 0],
              transition: {
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }
            }}
          >
            {`const resume = enhance(cv);`}
          </motion.div>
        ))}
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-white">Our</span>{" "}
            <span className="gradient-text-cyan">Process</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            From upload to download in 4 simple steps. No complex forms or long waits.
          </p>
        </motion.div>

        {/* Process Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              <GlassCard className="p-6 text-center h-full">
                {/* Step Number */}
                <div className="text-5xl font-black text-white/10 mb-4 group-hover:text-cyan-500/20 transition-colors">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-500/50 transition-all duration-300">
                  <step.icon className="w-6 h-6 text-cyan-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400">{step.description}</p>
              </GlassCard>

              {/* Connector Line */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-white/20 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-pink-500/20 border border-white/10 p-12 lg:p-16"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 blur-3xl" />

          <div className="relative z-10 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
              <span className="gradient-text">Ready to Transform</span>
              <br />
              <span className="text-white">Your Career?</span>
            </h2>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
              Join thousands of professionals who've landed their dream jobs with AI-enhanced resumes.
            </p>
            <a 
              href="/signup"
              className="btn-glow inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold"
            >
              Get Started Free
              <Sparkles className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
