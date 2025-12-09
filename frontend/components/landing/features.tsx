"use client"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { 
  Bot, 
  FileText, 
  Sparkles, 
  Zap, 
  Target,
  Download 
} from "lucide-react"
import { motion } from "framer-motion"

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative bg-black">
      <div className="container px-4 mx-auto">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Everything you need to <span className="text-blue-500">get hired.</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Our AI-powered platform provides a comprehensive suite of tools to help you craft the perfect resume.
          </p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}

const Skeleton = ({ color }: { color: string }) => (
  <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br ${color} opacity-20 animate-pulse`} />
)

const items = [
  {
    title: "AI Analysis",
    description: "Instant feedback on your resume's strengths and weaknesses.",
    header: <Skeleton color="from-blue-500 to-cyan-500" />,
    icon: <Bot className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "ATS Optimization",
    description: "Keywords and formatting tailored to beat the bots.",
    header: <Skeleton color="from-purple-500 to-pink-500" />,
    icon: <Target className="h-4 w-4 text-purple-500" />,
  },
  {
    title: "Smart Rewrite",
    description: "One-click enhancements for bullet points and summaries.",
    header: <Skeleton color="from-amber-500 to-orange-500" />,
    icon: <Sparkles className="h-4 w-4 text-amber-500" />,
  },
  {
    title: "Multiple Templates",
    description: "Choose from a gallery of professional, ATS-friendly designs.",
    header: <Skeleton color="from-emerald-500 to-lime-500" />,
    icon: <FileText className="h-4 w-4 text-emerald-500" />,
  },
  {
    title: "Instant Export",
    description: "Download in PDF or DOCX formats instantly.",
    header: <Skeleton color="from-red-500 to-pink-500" />,
    icon: <Download className="h-4 w-4 text-red-500" />,
  },
  {
    title: "Fast Processing",
    description: "Get your results in seconds, not hours.",
    header: <Skeleton color="from-indigo-500 to-blue-500" />,
    icon: <Zap className="h-4 w-4 text-indigo-500" />,
  },
]
