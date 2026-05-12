import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ModuleWyse — KTU AI Exam Prep",
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
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans antialiased">
        {/* Global cinematic background — fixed behind all pages */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/bg-gradient.png')" }}
          aria-hidden="true"
        />
        {children}
      </body>
    </html>
  );
}
