"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 sm:pt-6 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 border border-white/5",
          scrolled 
            ? "bg-black/40 backdrop-blur-xl w-[90%] md:w-[60%] lg:w-[40%] shadow-2xl shadow-black/50" 
            : "bg-transparent w-full max-w-7xl border-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs relative overflow-hidden">
            <span className="relative z-10">R</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </div>
          <span className={cn(
             "font-semibold tracking-tight transition-all duration-300",
             scrolled ? "text-sm" : "text-lg"
          )}>
            ResumeAI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {["Features", "Process", "Pricing"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/login"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup" 
            className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-white px-6 font-medium text-neutral-900 transition-all hover:bg-zinc-200"
          >
            <span className="text-xs font-bold">Get Started</span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 transition-opacity group-hover:opacity-10" />
          </Link>
        </div>
      </motion.nav>
    </div>
  )
}
