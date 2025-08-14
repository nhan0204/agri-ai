"use client"

import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/landing-page/header"
import BrandStory from "@/components/landing-page/brand-story"
import Features from "@/components/landing-page/features"
import HowToUse from "@/components/landing-page/how-to-use"
import Testimonials from "@/components/landing-page/testimonials"
import FAQ from "@/components/landing-page/faq"
import CTA from "@/components/landing-page/cta"
import SocialMedia from "@/components/landing-page/social-media"
import AIModelsInfo from "@/components/landing-page/ai-models-info"
import { Sprout, Video, Users, TrendingUp, Globe, Zap, Brain, MessageSquare } from "lucide-react"

import { redirect } from "next/navigation"

// Animation variants with proper typing
const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

const fadeInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

const floatingAnimation: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("ai-platform")

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <Header />

      {/* Hero Section with Tab Navigation */}
      <section
        id="product"
        className="min-h-screen pt-24 relative overflow-hidden bg-gradient-to-b from-orange-50 to-green-50"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <div className="container mx-auto px-4 pt-12 pb-24">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={floatingAnimation} animate="animate">
                <Brain className="h-10 w-10 text-green-600" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Fermy <span className="text-green-800">AgriTech</span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              AI-powered content remix tool to create localized, engaging TikTok videos for Southeast Asian smallholder
              farmers
            </motion.p>

            {/* Platform Statistics */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {[
                { number: "10K+", label: "Farmers Engaged" },
                { number: "500+", label: "Videos Remixed" },
                { number: "30%", label: "Engagement Boost" },
                { number: "8", label: "Languages Supported" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="text-3xl font-bold text-green-800 mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: [0.6, -0.05, 0.01, 0.99] }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 mb-8">
                  <TabsTrigger onClick={() => setActiveTab('ai-platform')} value="ai-platform" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Content Remix
                  </TabsTrigger>
                  <TabsTrigger onClick={() => setActiveTab('about')} value="about" className="flex items-center gap-2">
                    <Sprout className="h-4 w-4" />
                    About Fermy
                  </TabsTrigger>
                </TabsList> */}

                <AnimatePresence mode="wait">
                  <TabsContent key="ai-platform" value="ai-platform" className="space-y-4">
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Video Remix for Farmers</h2>
                      <p className="text-gray-600 mb-6">
                        Transform existing TikTok videos into localized, engaging content for smallholder farmers. Our
                        AI transcribes, extracts insights, remixes clips, and generates voiceovers in multiple
                        languages.
                      </p>
                      <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        <motion.div variants={fadeInLeft}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => redirect('/demo')}
                            >
                              Try Content Remix Tool
                            </Button>
                          </motion.div>
                        </motion.div>
                        <motion.div variants={fadeInRight}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" variant="outline" className="bg-transparent">
                              Watch Demo
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent key="about" value="about" className="space-y-4">
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Empowering Southeast Asian Farmers</h2>
                      <p className="text-gray-600 mb-6">
                        Fermy AgriTech combines AI innovation with agricultural expertise to deliver practical,
                        actionable knowledge to smallholder farmers via TikTok.
                      </p>
                      <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        <motion.div variants={fadeInLeft}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" className="bg-green-800 hover:bg-green-900 text-white">
                              Learn More
                            </Button>
                          </motion.div>
                        </motion.div>
                        <motion.div variants={fadeInRight}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" variant="outline" className="bg-transparent">
                              Our Mission
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="ai-platform" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">AI-Powered Content Creation Ecosystem</h2>
            <p className="text-xl text-gray-600">
              Streamline the creation of localized TikTok videos to educate and engage smallholder farmers in Southeast
              Asia
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Video,
                title: "Video Remix",
                description: "AI extracts key moments from TikTok videos and combines them into new content.",
                color: "bg-green-100",
                iconColor: "text-green-600",
              },
              {
                icon: Globe,
                title: "Localized Voiceovers",
                description: "Generate AI voiceovers in 8+ Southeast Asian languages.",
                color: "bg-green-100",
                iconColor: "text-green-600",
              },
              {
                icon: Brain,
                title: "Insight Extraction",
                description: "Transcribe and identify key agricultural insights from videos.",
                color: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                icon: Zap,
                title: "Automation",
                description: "Integrate with workflows for seamless content production.",
                color: "bg-orange-100",
                iconColor: "text-orange-600",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow h-full">
                  <motion.div
                    className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                  >
                    <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <AnimatePresence mode="wait">
          <TabsContent key="ai-platform-main" value="ai-platform">
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* AI Platform Introduction */}
              <section className="py-24 bg-gradient-to-b from-white to-green-50">
                <div className="container mx-auto px-4">
                  <motion.div
                    className="max-w-4xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
                    >
                      <Badge className="bg-green-100 text-green-800 mb-4">
                        <Brain className="h-3 w-3 mr-1" />
                        AI-Powered Content Creation
                      </Badge>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Transform Videos for Farmer Engagement
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Our AI Content Remix Tool takes existing TikTok videos, extracts key agricultural insights, and
                      creates localized, engaging videos to educate smallholder farmers in Southeast Asia.
                    </p>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    {[
                      {
                        icon: MessageSquare,
                        title: "Content Remix",
                        description:
                          "Combine key clips from TikTok videos into a new, engaging video tailored for farmers.",
                      },
                      {
                        icon: Globe,
                        title: "Multi-Language Voiceovers",
                        description:
                          "Generate AI voiceovers in 8+ Southeast Asian languages with culturally relevant context.",
                      },
                      {
                        icon: Zap,
                        title: "Automated Workflow",
                        description: "Streamline content creation with integrations for N8N, Airtable, and Zapier.",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="p-6 h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                            >
                              <item.icon className="h-6 w-6 text-green-600" />
                            </motion.div>
                            <h3 className="text-xl font-bold">{item.title}</h3>
                          </div>
                          <p className="text-gray-600">{item.description}</p>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>

              {/* AI Models Information */}
              <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                  >
                    <AIModelsInfo />
                  </motion.div>
                </div>
              </section>

              {/* Platform Benefits */}
              <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                  <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Our AI Remix Tool?</h2>
                    <p className="text-xl text-gray-600">
                      Designed to create impactful, localized content for smallholder farmers
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                      className="space-y-8"
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {[
                        {
                          icon: Users,
                          title: "Farmer-Focused Content",
                          description:
                            "Creates practical, culturally relevant videos that resonate with smallholder farmers.",
                          color: "bg-green-100",
                          iconColor: "text-green-600",
                        },
                        {
                          icon: Brain,
                          title: "Agricultural AI",
                          description:
                            "AI models trained on crop diseases, farming practices, and agricultural knowledge.",
                          color: "bg-green-100",
                          iconColor: "text-green-600",
                        },
                        {
                          icon: Zap,
                          title: "Scalable Production",
                          description: "Automate content creation with integrations for efficient workflows.",
                          color: "bg-purple-100",
                          iconColor: "text-purple-600",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex gap-4"
                          variants={fadeInLeft}
                          whileHover={{ x: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <motion.div
                            className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                          >
                            <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, x: 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="p-8 bg-gradient-to-br from-orange-50 to-green-50">
                          <div className="text-center space-y-6">
                            <motion.div
                              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
                            >
                              <TrendingUp className="h-10 w-10 text-green-600" />
                            </motion.div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">Proven Impact</h3>
                              <p className="text-gray-600 mb-4">
                                Our AI-remixed videos have boosted farmer engagement by 300% and knowledge retention by
                                45%.
                              </p>
                            </div>
                            <motion.div
                              className="grid grid-cols-2 gap-4 text-center"
                              variants={staggerContainer}
                              initial="initial"
                              whileInView="animate"
                              viewport={{ once: true }}
                            >
                              <motion.div variants={scaleIn}>
                                <div className="text-2xl font-bold text-green-600">300%</div>
                                <div className="text-sm text-gray-600">Engagement Increase</div>
                              </motion.div>
                              <motion.div variants={scaleIn}>
                                <div className="text-2xl font-bold text-green-600">45%</div>
                                <div className="text-sm text-gray-600">Knowledge Retention</div>
                              </motion.div>
                            </motion.div>
                          </div>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* CTA for AI Platform */}
              <section className="py-24 bg-gradient-to-b from-white to-green-50">
                <div className="container mx-auto px-4">
                  <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Create Impactful Farmer Content Today
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                      Test our AI Content Remix Tool to produce localized TikTok videos for smallholder farmers in
                      Southeast Asia.
                    </p>
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4 justify-center"
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      <motion.div variants={fadeInUp}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8"
                            onClick={() => redirect('/demo')}
                          >
                            Start Now
                          </Button>
                        </motion.div>
                      </motion.div>
                      {/* <motion.div variants={fadeInUp}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="lg" variant="outline" className="bg-transparent"
                            onClick={() => redirect('/demo')}
                          >
                            Schedule Demo
                          </Button>
                        </motion.div>
                      </motion.div> */}
                    </motion.div>
                    {/* <motion.p
                      className="text-sm text-gray-500 mt-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
                    >
                      No credit card required • Full platform access
                    </motion.p> */}
                  </motion.div>
                </div>
              </section>
            </motion.main>
          </TabsContent>

          <TabsContent key="about-main" value="about">
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BrandStory />
              <Features />
              <HowToUse />
              <Testimonials />
              <FAQ />
              <CTA />
            </motion.main>
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      <SocialMedia />
    </div>
  )
}
