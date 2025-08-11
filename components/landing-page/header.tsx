"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Sprout, Brain } from "lucide-react"

import { redirect } from "next/navigation"


const menuItemVariants: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mounted])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        mounted && isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sprout className="h-8 w-8 text-green-600" />
            </motion.div>
            <div className="text-xl font-bold text-gray-900">
              Fermy <span className="text-green-800">AgriTech</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {[
              { href: "#products", label: "Products" },
              { href: "#ai-platform", label: "AI Platform", icon: Brain },
              { href: "#farmers", label: "For Farmers" },
              { href: "#about", label: "About" },
            ].map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="text-gray-800 hover:text-green-800 transition-colors duration-300 font-serif flex items-center gap-1"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.6, -0.05, 0.01, 0.99] }}
                whileHover={{ y: -2 }}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </motion.a>
            ))}

            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-green-800 text-green-800 hover:bg-green-800 hover:text-white bg-transparent"
                  onClick={() => redirect('/demo')}
                >
                  Contact Us
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Try AI Platform</Button>
              </motion.div>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-gray-800"
            onClick={() => setIsMenuOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="h-6 w-6" />
          </motion.button>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mounted && isMenuOpen && (
              <motion.div
                className="fixed top-0 right-0 h-screen w-full bg-white md:hidden z-50"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                suppressHydrationWarning
              >
                <motion.button
                  className="absolute top-6 right-6 text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>

                <motion.div
                  className="flex flex-col items-center justify-center h-full space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {[
                    { href: "#products", label: "Products" },
                    { href: "#ai-platform", label: "AI Platform", icon: Brain },
                    { href: "#farmers", label: "For Farmers" },
                    { href: "#about", label: "About" },
                  ].map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      className="text-gray-800 hover:text-green-800 transition-colors duration-300 font-serif text-xl flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                      variants={menuItemVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.label}
                    </motion.a>
                  ))}

                  <motion.div
                    className="flex flex-col space-y-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="border-green-800 text-green-800 hover:bg-green-800 hover:text-white bg-transparent"
                      >
                        Contact Us
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Try AI Platform</Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}
