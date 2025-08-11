"use client"

import type React from "react"
import { Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SocialMedia() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Join the Fermy Community</h2>
        <div className="text-xl text-gray-600 mb-8">Get the latest news, campaigns, and healthy recipes!</div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Instagram className="h-4 w-4" />
            Follow on Instagram
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Twitter className="h-4 w-4" />
            Follow on X
          </Button>
        </div>
        <div className="text-gray-600 mb-4">Share with #FermyHabit!</div>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <Button type="submit" className="w-full bg-green-800 hover:bg-green-900 text-white">
              Subscribe to Newsletter
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
