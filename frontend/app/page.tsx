"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero"
import { FeaturesSection } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 selection:text-blue-200">
      <div className="fixed inset-0 bg-noise pointer-events-none z-50 opacity-10 mix-blend-overlay" />
      
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      
      <Footer />
    </main>
  )
}
