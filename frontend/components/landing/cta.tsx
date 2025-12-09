"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-32 bg-[var(--background)] relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-fab-red/10 blur-[200px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-fab-red/30 bg-fab-red/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-fab-red" />
            <span className="font-pixel text-xs text-fab-red tracking-wider uppercase">Start For Free</span>
          </motion.div>

          {/* Main Heading */}
          <h2 className="font-barlow font-bold text-5xl md:text-7xl lg:text-8xl text-[var(--foreground)] uppercase leading-[0.9] tracking-tighter mb-8">
            Ready to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fab-red via-purple-500 to-fab-blue">
              Get Hired?
            </span>
          </h2>

          <p className="font-sans text-xl md:text-2xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-12 leading-relaxed">
            Join thousands of professionals who transformed their job search with AI-powered resume optimization.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/signup" 
              className="group relative px-10 py-5 bg-fab-red text-white font-barlow font-bold text-xl uppercase tracking-wider rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_60px_-15px_rgba(252,73,76,0.5)]"
            >
              <span className="flex items-center gap-3">
                Create Your Resume
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              href="#process" 
              className="px-10 py-5 border border-[var(--border)] text-[var(--foreground)] font-barlow font-semibold text-xl uppercase tracking-wider rounded-xl transition-all hover:bg-[var(--surface-hover)]"
            >
              See How It Works
            </Link>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[var(--muted-foreground)]"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-sans text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-sans text-sm">5 free analyses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-sans text-sm">Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
