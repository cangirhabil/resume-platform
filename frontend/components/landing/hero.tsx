"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const HeroSection = () => {
  return (
    <section className="relative min-h-[110vh] flex flex-col justify-center items-center overflow-hidden pt-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="container px-4 text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">AI-Powered Resume Builder</span>
        </motion.div>

        {/* Massive Typography */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8"
          >
            {["Craft", "Your", "Legacy"].map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.div>
        </h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-xl mx-auto text-lg sm:text-xl text-zinc-400 mb-10 leading-relaxed"
        >
          Transform your career story with intelligent analysis and ATS-optimized formatting. 
          Built for the modern professional.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup" className="group relative px-8 py-4 rounded-full bg-white text-black font-semibold text-lg transition-transform hover:scale-105 active:scale-95">
            <span className="relative z-10 flex items-center gap-2">
              Start Building <ArrowRight className="w-4 h-4" />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur opacity-20 group-hover:opacity-40 transition-opacity" />
          </Link>
          <Link href="#process" className="px-8 py-4 rounded-full text-zinc-300 hover:text-white transition-colors border border-white/10 hover:bg-white/5 font-medium">
            How it works
          </Link>
        </motion.div>
      </div>

      {/* 3D-ish Interface Mockup */}
      <motion.div
        initial={{ opacity: 0, rotateX: 20, y: 100 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
        className="mt-20 relative z-20 perspective-1000 w-full max-w-5xl mx-auto px-4"
      >
        <div className="relative rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl shadow-blue-900/20 overflow-hidden transform-gpu preserve-3d group">
          {/* Header Bar */}
          <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 text-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 text-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 text-green-500" />
          </div>
          
          {/* Grid Content */}
          <div className="grid grid-cols-12 p-1 gap-1 h-[400px] sm:h-[600px] bg-zinc-950/50">
             {/* Sidebar */}
             <div className="col-span-3 border-r border-white/5 p-4 space-y-4 hidden sm:block">
               <div className="h-2 w-20 bg-zinc-800 rounded animate-pulse" />
               <div className="h-2 w-16 bg-zinc-800 rounded animate-pulse" />
               <div className="h-2 w-24 bg-zinc-800 rounded animate-pulse" />
             </div>
             
             {/* Main Canvas */}
             <div className="col-span-12 sm:col-span-9 p-8 flex flex-col items-center justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
               
               {/* Floating Elements inside Mockup */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="relative z-10 p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl w-3/4 max-w-sm"
               >
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                   <div>
                     <div className="h-2 w-24 bg-zinc-700 rounded mb-1" />
                     <div className="h-2 w-16 bg-zinc-800 rounded" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <div className="h-2 w-full bg-zinc-800 rounded" />
                   <div className="h-2 w-full bg-zinc-800 rounded" />
                   <div className="h-2 w-2/3 bg-zinc-800 rounded" />
                 </div>
                 
                 {/* Success Badge */}
                 <div className="absolute -right-4 -top-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg shadow-green-900/50">
                   98% MATCH
                 </div>
               </motion.div>
             </div>
          </div>
        </div>
        
        {/* Reflection */}
        <div className="absolute -bottom-4 inset-x-0 h-40 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl -z-10" />
      </motion.div>
    </section>
  )
}
