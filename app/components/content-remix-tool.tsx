"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  Play,
  Download,
  Wand2,
  FileVideo,
  MessageSquare,
  Mic,
  Sprout,
  Bug,
  Droplets,
  TrendingUp,
  Zap,
} from "lucide-react"

interface VideoInput {
  id: string
  url: string
  title: string
  duration: string
  thumbnail: string
}

interface ExtractedInsight {
  timestamp: string
  content: string
  category: "disease" | "treatment" | "yield" | "general"
  confidence: number
}

interface GeneratedScript {
  title: string
  hook: string
  mainContent: string
  callToAction: string
  hashtags: string[]
  targetAudience: string
}

export default function ContentRemixTool() {
  const [currentStep, setCurrentStep] = useState(1)
  const [videoInputs, setVideoInputs] = useState<VideoInput[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [extractedInsights, setExtractedInsights] = useState<ExtractedInsight[]>([])
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
  const [voiceGenerated, setVoiceGenerated] = useState(false)

  // Sample data for demonstration
  const sampleVideos: VideoInput[] = [
    {
      id: "1",
      url: "https://tiktok.com/@farmer_tips/video1",
      title: "Rice Blast Disease Identification",
      duration: "0:45",
      thumbnail: "/placeholder.svg?height=120&width=120&text=Rice+Disease",
    },
    {
      id: "2",
      url: "https://tiktok.com/@agri_expert/video2",
      title: "Organic Pest Control Methods",
      duration: "1:20",
      thumbnail: "/placeholder.svg?height=120&width=120&text=Pest+Control",
    },
    {
      id: "3",
      url: "https://tiktok.com/@crop_doctor/video3",
      title: "Fertilizer Application Timing",
      duration: "0:55",
      thumbnail: "/placeholder.svg?height=120&width=120&text=Fertilizer",
    },
  ]

  const sampleInsights: ExtractedInsight[] = [
    {
      timestamp: "0:15",
      content: "Brown spots with yellow halos indicate rice blast disease",
      category: "disease",
      confidence: 0.95,
    },
    {
      timestamp: "0:32",
      content: "Apply fungicide early morning or late evening for best results",
      category: "treatment",
      confidence: 0.88,
    },
    {
      timestamp: "1:05",
      content: "Neem oil spray can reduce pest damage by 70%",
      category: "treatment",
      confidence: 0.92,
    },
    {
      timestamp: "0:48",
      content: "Split fertilizer application increases yield by 15-20%",
      category: "yield",
      confidence: 0.9,
    },
  ]

  const sampleScript: GeneratedScript = {
    title: "Stop Rice Disease Before It Destroys Your Harvest! 🌾",
    hook: "Are brown spots killing your rice plants? Here's what every farmer needs to know!",
    mainContent: `First, look for these warning signs: brown spots with yellow rings on your rice leaves. This is rice blast disease, and it can destroy 30% of your harvest if not treated quickly.

Here's your 3-step action plan:
1. Identify early - check plants every morning
2. Apply organic neem oil spray in the evening 
3. Use proper fungicide if disease spreads

Pro tip from successful farmers: Split your fertilizer application into 3 parts instead of 1. This simple change can boost your yield by 20% and make plants stronger against disease.

Remember: Prevention is cheaper than cure. Healthy soil = healthy plants = better profits!`,
    callToAction:
      "Save this video and share with fellow farmers! What's your biggest crop challenge? Comment below! 👇",
    hashtags: [
      "#RiceBlast",
      "#CropDisease",
      "#SmallholderFarmer",
      "#OrganicFarming",
      "#AgriTips",
      "#FarmLife",
      "#SustainableAgriculture",
    ],
    targetAudience: "Smallholder rice farmers in Southeast Asia",
  }

  const handleAddSampleVideos = () => {
    setVideoInputs(sampleVideos)
    setCurrentStep(2)
  }

  const handleProcessVideos = async () => {
    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate processing steps
    const steps = [
      "Downloading videos...",
      "Transcribing audio...",
      "Analyzing agricultural content...",
      "Extracting key insights...",
      "Identifying remix opportunities...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setProcessingProgress((i + 1) * 20)
    }

    setExtractedInsights(sampleInsights)
    setIsProcessing(false)
    setCurrentStep(3)
  }

  const handleGenerateScript = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setGeneratedScript(sampleScript)
    setIsProcessing(false)
    setCurrentStep(4)
  }

  const handleGenerateVoiceover = async () => {
    setIsGeneratingVoice(true)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    setIsGeneratingVoice(false)
    setVoiceGenerated(true)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "disease":
        return <Bug className="h-4 w-4" />
      case "treatment":
        return <Droplets className="h-4 w-4" />
      case "yield":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Sprout className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "disease":
        return "bg-red-100 text-red-800"
      case "treatment":
        return "bg-blue-100 text-blue-800"
      case "yield":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              <Wand2 className="h-3 w-3 mr-1" />
              AI Content Creation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI-Powered Content Remix Tool</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform existing agricultural TikTok videos into localized, engaging content tailored for smallholder
              farmers across Southeast Asia
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Tabs value={`step-${currentStep}`} className="w-full">
            {/* Step 1: Video Input */}
            <TabsContent value="step-1">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Step 1: Input Agricultural TikTok Videos
                  </CardTitle>
                  <CardDescription>
                    Add TikTok videos containing agricultural knowledge to remix and localize for farmers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white/50">
                    <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Agricultural TikTok Videos</h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop video files or paste TikTok URLs with farming content
                    </p>
                    <div className="space-y-3">
                      <Input placeholder="Paste TikTok URL here..." className="max-w-md mx-auto" />
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" className="bg-white/80">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Files
                        </Button>
                        <Button onClick={handleAddSampleVideos} className="bg-blue-600 hover:bg-blue-700">
                          Use Sample Videos
                        </Button>
                      </div>
                    </div>
                  </div>

                  {videoInputs.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Added Videos ({videoInputs.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {videoInputs.map((video) => (
                          <Card key={video.id} className="overflow-hidden bg-white">
                            <div className="aspect-video bg-gray-100 relative">
                              <img
                                src={video.thumbnail || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {video.duration}
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <h5 className="font-medium text-sm truncate">{video.title}</h5>
                              <p className="text-xs text-gray-600 truncate">{video.url}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Button onClick={handleProcessVideos} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                        <Wand2 className="h-4 w-4 mr-2" />
                        Process Videos with AI
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2: Processing */}
            <TabsContent value="step-2">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Step 2: AI Analysis & Agricultural Insight Extraction
                  </CardTitle>
                  <CardDescription>Analyzing videos for agricultural insights and remix opportunities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isProcessing ? (
                    <div className="text-center space-y-4">
                      <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Processing agricultural content...</p>
                        <Progress value={processingProgress} className="max-w-md mx-auto" />
                        <p className="text-sm text-gray-600">{processingProgress}% complete</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="text-center p-4 bg-white">
                          <Bug className="h-8 w-8 text-red-600 mx-auto mb-2" />
                          <h4 className="font-medium">Disease ID</h4>
                          <p className="text-2xl font-bold text-red-600">3</p>
                          <p className="text-xs text-gray-600">Issues detected</p>
                        </Card>
                        <Card className="text-center p-4 bg-white">
                          <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-medium">Treatments</h4>
                          <p className="text-2xl font-bold text-blue-600">5</p>
                          <p className="text-xs text-gray-600">Solutions found</p>
                        </Card>
                        <Card className="text-center p-4 bg-white">
                          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-medium">Yield Tips</h4>
                          <p className="text-2xl font-bold text-green-600">4</p>
                          <p className="text-xs text-gray-600">Improvement methods</p>
                        </Card>
                        <Card className="text-center p-4 bg-white">
                          <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <h4 className="font-medium">Key Insights</h4>
                          <p className="text-2xl font-bold text-purple-600">12</p>
                          <p className="text-xs text-gray-600">Total extracted</p>
                        </Card>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Extracted Agricultural Insights
                        </h4>
                        <div className="space-y-3">
                          {extractedInsights.map((insight, index) => (
                            <Card key={index} className="p-4 bg-white">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getCategoryIcon(insight.category)}
                                    <Badge className={getCategoryColor(insight.category)}>{insight.category}</Badge>
                                    <span className="text-sm text-gray-500">{insight.timestamp}</span>
                                  </div>
                                  <p className="text-gray-900">{insight.content}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-green-600">
                                    {Math.round(insight.confidence * 100)}%
                                  </div>
                                  <div className="text-xs text-gray-500">confidence</div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <Button onClick={handleGenerateScript} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Farmer-Focused Script
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 3: Script Generation */}
            <TabsContent value="step-3">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Step 3: AI-Generated Localized Script
                  </CardTitle>
                  <CardDescription>Engaging content script optimized for smallholder farmers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isProcessing ? (
                    <div className="text-center space-y-4">
                      <div className="animate-pulse">
                        <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      </div>
                      <p className="text-lg font-medium">Generating farmer-focused script...</p>
                      <p className="text-sm text-gray-600">
                        Using agricultural AI to create engaging, localized content
                      </p>
                    </div>
                  ) : (
                    generatedScript && (
                      <div className="space-y-6">
                        {/* Script Preview */}
                        <div className="bg-white border rounded-lg p-6 space-y-4">
                          <div>
                            <h4 className="font-medium text-blue-600 mb-2">Video Title</h4>
                            <p className="text-lg font-bold">{generatedScript.title}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-blue-600 mb-2">Hook (First 3 seconds)</h4>
                            <p className="text-gray-900">{generatedScript.hook}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-blue-600 mb-2">Main Content</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                                {generatedScript.mainContent}
                              </pre>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-blue-600 mb-2">Call to Action</h4>
                            <p className="text-gray-900">{generatedScript.callToAction}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-blue-600 mb-2">Hashtags</h4>
                            <div className="flex flex-wrap gap-2">
                              {generatedScript.hashtags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-blue-600">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-blue-600 mb-2">Target Audience</h4>
                            <p className="text-sm text-gray-600">{generatedScript.targetAudience}</p>
                          </div>
                        </div>

                        {/* Script Actions */}
                        <div className="flex gap-4">
                          <Button variant="outline" className="flex-1 bg-white/80">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Edit Script
                          </Button>
                          <Button onClick={() => setCurrentStep(4)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <Mic className="h-4 w-4 mr-2" />
                            Generate Voiceover
                          </Button>
                        </div>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 4: Voiceover & Output */}
            <TabsContent value="step-4">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Step 4: Multi-Language AI Voiceover & Final Output
                  </CardTitle>
                  <CardDescription>Generate natural-sounding voiceover in Southeast Asian languages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Voice Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-white">
                      <h4 className="font-medium mb-2">Language</h4>
                      <select className="w-full p-2 border rounded-md">
                        <option>English</option>
                        <option>Bahasa Indonesia</option>
                        <option>Thai</option>
                        <option>Vietnamese</option>
                        <option>Tagalog</option>
                        <option>Khmer</option>
                        <option>Myanmar</option>
                        <option>Lao</option>
                      </select>
                    </Card>
                    <Card className="p-4 bg-white">
                      <h4 className="font-medium mb-2">Voice Style</h4>
                      <select className="w-full p-2 border rounded-md">
                        <option>Friendly Farmer</option>
                        <option>Expert Advisor</option>
                        <option>Enthusiastic Teacher</option>
                        <option>Local Extension Worker</option>
                      </select>
                    </Card>
                    <Card className="p-4 bg-white">
                      <h4 className="font-medium mb-2">Speed</h4>
                      <select className="w-full p-2 border rounded-md">
                        <option>Normal</option>
                        <option>Slow (Better for learning)</option>
                        <option>Fast</option>
                      </select>
                    </Card>
                  </div>

                  {/* Voiceover Generation */}
                  <div className="space-y-4">
                    {!voiceGenerated ? (
                      <Button
                        onClick={handleGenerateVoiceover}
                        disabled={isGeneratingVoice}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        {isGeneratingVoice ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Generating Multi-Language Voiceover...
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Generate AI Voiceover
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        {/* Audio Player */}
                        <Card className="p-6 bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Generated Voiceover</h4>
                            <Badge className="bg-green-100 text-green-800">Ready</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full w-0"></div>
                            </div>
                            <span className="text-sm text-gray-600">2:15</span>
                          </div>
                        </Card>

                        {/* Final Output Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="p-4 bg-white">
                            <h4 className="font-medium mb-2">Download Assets</h4>
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                                <Download className="h-4 w-4 mr-2" />
                                Script (TXT)
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                                <Download className="h-4 w-4 mr-2" />
                                Voiceover (MP3)
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                                <Download className="h-4 w-4 mr-2" />
                                Video Draft (MP4)
                              </Button>
                            </div>
                          </Card>

                          <Card className="p-4 bg-white">
                            <h4 className="font-medium mb-2">Automation & Distribution</h4>
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                                <Zap className="h-4 w-4 mr-2" />
                                Send to N8N Workflow
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                                <Zap className="h-4 w-4 mr-2" />
                                Save to Airtable
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                                <Zap className="h-4 w-4 mr-2" />
                                Schedule TikTok Post
                              </Button>
                            </div>
                          </Card>
                        </div>

                        {/* Success Message */}
                        <Card className="p-6 bg-green-50 border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-green-900">
                                Agricultural Content Successfully Generated!
                              </h4>
                              <p className="text-sm text-green-700">
                                Your remixed agricultural content is ready for smallholder farmers. The script combines
                                insights from 3 source videos and is optimized for farmer engagement and education.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
