"use client"

import { Terminal } from "lucide-react"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)] pt-20 pb-10 transition-colors duration-300">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-fab-red/20 flex items-center justify-center text-fab-red">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-barlow font-bold text-2xl tracking-tighter uppercase text-[var(--foreground)]">
                ResumeAI
              </span>
            </Link>
            <p className="font-sans text-[var(--muted-foreground)] text-sm leading-relaxed max-w-xs">
              Intelligent agents working 24/7 to perfect your professional narrative.
            </p>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border)]">
                <span className="font-pixel text-[10px] text-[var(--muted-foreground)]">V2.0.4 STABLE</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-pixel text-xs text-[var(--muted-foreground)] uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2">
                {["Analysis", "Rewrite", "Templates", "Export"].map(item => (
                  <li key={item}>
                    <Link href="#" className="font-sans text-sm text-[var(--muted-foreground)] hover:text-fab-red transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-pixel text-xs text-[var(--muted-foreground)] uppercase tracking-widest">Company</h4>
              <ul className="space-y-2">
                {["About", "Careers", "Blog", "Press"].map(item => (
                  <li key={item}>
                    <Link href="#" className="font-sans text-sm text-[var(--muted-foreground)] hover:text-fab-red transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-pixel text-xs text-[var(--muted-foreground)] uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Security", "Cookies"].map(item => (
                  <li key={item}>
                    <Link href="#" className="font-sans text-sm text-[var(--muted-foreground)] hover:text-fab-red transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "GitHub", "Discord", "LinkedIn"].map(social => (
              <Link key={social} href="#" className="font-sans text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors uppercase tracking-wider">
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
