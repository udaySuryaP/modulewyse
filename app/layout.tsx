import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ModuleWyse - KTU AI Exam Prep",
    template: "%s | ModuleWyse",
  },
  description:
    "A curated AI exam-prep platform for KTU students with module-aware, syllabus-grounded answers from structured academic notes.",
  keywords: [
    "KTU",
    "exam prep",
    "AI",
    "CSE",
    "module-aware",
    "syllabus",
    "notes",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
