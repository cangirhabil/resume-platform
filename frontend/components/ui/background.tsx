"use client"

import { useEffect, useRef } from "react"

export function NoiseBackground() {
  return (
    <>
      {/* SVG Noise Filter */}
      <svg className="fixed inset-0 pointer-events-none z-[9999] w-full h-full opacity-[0.03] mix-blend-overlay">
        <filter id="noise">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Cyan Blob - Top Right */}
        <div 
          className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        
        {/* Violet Blob - Bottom Left */}
        <div 
          className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full animate-float-delayed"
          style={{
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        
        {/* Pink Blob - Center */}
        <div 
          className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>
    </>
  )
}

export function GlassCard({ 
  children, 
  className = "",
  glowColor = "cyan",
  hover = true
}: { 
  children: React.ReactNode
  className?: string
  glowColor?: "cyan" | "violet" | "amber" | "pink" | "emerald"
  hover?: boolean
}) {
  const glowClasses = {
    cyan: "hover:glow-border-cyan",
    violet: "hover:glow-border-violet",
    amber: "hover:glow-border-amber",
    pink: "hover:glow-border-pink",
    emerald: "hover:glow-border-emerald",
  }

  return (
    <div 
      className={`
        bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl
        ${hover ? 'hover:bg-white/10 transition-all duration-300' : ''}
        ${hover ? glowClasses[glowColor] : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function FloatingElement({ 
  children, 
  delay = 0,
  duration = 6,
  className = ""
}: { 
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  return (
    <div 
      className={`animate-float ${className}`}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  )
}

export function GradientOrb({ 
  color = "cyan",
  size = "md",
  className = ""
}: { 
  color?: "cyan" | "violet" | "pink" | "amber" | "emerald"
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const colorMap = {
    cyan: "rgba(6, 182, 212, 0.4)",
    violet: "rgba(129, 140, 248, 0.4)",
    pink: "rgba(236, 72, 153, 0.4)",
    amber: "rgba(245, 158, 11, 0.4)",
    emerald: "rgba(16, 185, 129, 0.4)",
  }
  
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  return (
    <div 
      className={`rounded-full blur-xl ${sizeMap[size]} ${className}`}
      style={{ background: colorMap[color] }}
    />
  )
}
