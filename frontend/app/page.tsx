"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero"
import { ProcessSection } from "@/components/landing/process"
import { FeaturesSection } from "@/components/landing/features"
import { CTASection } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Noise Overlay - only visible in dark mode */}
      <div className="fixed inset-0 bg-noise pointer-events-none z-50 opacity-5 mix-blend-overlay dark:opacity-5 light:opacity-0" />
      
      <Navbar />
      <HeroSection />
      <ProcessSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
