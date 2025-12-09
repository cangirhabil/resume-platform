"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

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
          "pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 border",
          scrolled 
            ? "bg-[var(--surface)]/80 backdrop-blur-xl w-[95%] md:w-[90%] lg:w-[75%] xl:w-[60%] shadow-2xl border-[var(--border)]" 
            : "bg-transparent w-full max-w-7xl border-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fab-red to-fab-blue flex items-center justify-center text-white font-bold text-xs relative overflow-hidden">
            <span className="relative z-10">R</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </div>
          <span className={cn(
             "font-semibold tracking-tight transition-all duration-300 text-[var(--foreground)]",
             scrolled ? "text-sm" : "text-lg"
          )}>
            ResumeAI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {["Features", "Process", "Pricing"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--foreground)] transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link 
            href="/login"
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup" 
            className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-fab-red px-6 font-medium text-white transition-all hover:scale-105"
          >
            <span className="text-xs font-bold">Get Started</span>
          </Link>
        </div>
      </motion.nav>
    </div>
  )
}
