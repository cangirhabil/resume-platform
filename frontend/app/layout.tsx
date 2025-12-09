import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeAI | AI-Powered Resume Enhancement",
  description: "Transform your resume into a job-winning document with AI-powered analysis and optimization. ATS-friendly, professional, and effective.",
  keywords: ["resume", "AI", "career", "job", "ATS", "optimization"],
  authors: [{ name: "ResumeAI" }],
  openGraph: {
    title: "ResumeAI | AI-Powered Resume Enhancement",
    description: "Transform your resume into a job-winning document with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
