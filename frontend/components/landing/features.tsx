"use client"

import { BentoGrid } from "@/components/ui/bento-grid"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Bot, Target, Sparkles, Download, Crosshair, Zap } from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-[var(--background)] relative z-10 transition-colors duration-300">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="mb-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
             <div className="h-px w-12 bg-fab-blue" />
             <span className="font-pixel text-fab-blue text-sm tracking-widest uppercase">Platform Capabilities</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-barlow font-bold text-5xl md:text-7xl text-[var(--foreground)] uppercase leading-[0.9] tracking-tighter mb-8"
          >
            Core <br />
            <span className="text-[var(--muted-foreground)]">Features.</span>
          </motion.h2>

          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="font-sans text-xl text-[var(--muted-foreground)] max-w-2xl leading-relaxed"
          >
            Every tool you need to craft a resume that gets interviews. Powered by AI, optimized for humans.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FeatureCard
              key={i}
              index={i}
              title={item.title}
              description={item.description}
              icon={item.icon}
              color={item.color}
              className={item.span === 2 ? "lg:col-span-2" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const FeatureCard = ({
  index,
  title,
  description,
  icon: Icon,
  color,
  className
}: {
  index: number
  title: string
  description: string
  icon: React.ElementType
  color: string
  className?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={cn(
        "relative p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] group overflow-hidden h-[300px] flex flex-col justify-between hover:border-[var(--foreground)]/20 transition-colors",
        className
      )}
    >
      {/* Background Glow on Hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 blur-3xl"
        style={{ backgroundColor: color }}
      />
      
      {/* Icon */}
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[var(--border)] group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 mt-auto">
        <h3 className="font-barlow font-bold text-2xl md:text-3xl text-[var(--foreground)] uppercase leading-tight mb-3">
          {title}
        </h3>
        <p className="font-sans text-[var(--muted-foreground)] text-sm md:text-base leading-relaxed group-hover:text-[var(--foreground)] transition-colors">
          {description}
        </p>
      </div>

      {/* Corner Accent */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  )
}

const items = [
  {
    title: "AI Analysis",
    description: "Deep learning algorithms scan your resume against thousands of job descriptions in real-time.",
    icon: Bot,
    color: "#fc494c"
  },
  {
    title: "ATS Optimization",
    description: "Ensure your resume passes automated filters used by 99% of Fortune 500 companies.",
    icon: Target,
    color: "#0099ff",
    span: 2
  },
  {
    title: "Instant Rewrite",
    description: "One-click polishing of bullet points to maximize impact and readability.",
    icon: Sparkles,
    color: "#a855f7"
  },
  {
    title: "Smart Targeting",
    description: "Tailor your resume for specific job roles with intelligent keyword injection.",
    icon: Crosshair,
    color: "#f59e0b"
  },
  {
    title: "Fast Processing",
    description: "Get your results in seconds. Our infrastructure processes thousands of resumes per minute.",
    icon: Zap,
    color: "#10b981"
  },
  {
    title: "Multi-Format Export",
    description: "Download perfectly formatted PDF and DOCX files ready for any application.",
    icon: Download,
    color: "#0099ff"
  }
]
