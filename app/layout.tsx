import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google"
import "./globals.css"

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Fermy AgriTech - Revolutionary Agricultural Solutions & AI Content Platform",
  description:
    "Combining traditional fermentation wisdom with cutting-edge AI technology. Fermy offers health products and AI-powered content creation tools for Southeast Asian farmers.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${notoSans.variable}`} suppressHydrationWarning>
      <body
        className={`font-sans antialiased min-h-screen bg-background text-foreground ${notoSans.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
