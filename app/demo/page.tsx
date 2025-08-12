"use client"

import { useState } from "react"
import { VideoUpload } from "@/components/video-upload"
import { TranscriptionResults } from "@/components/transcription-results"
import { ScriptGeneration } from "@/components/script-generator"
import { VoiceoverPreview } from "@/components/voiceover-preview"
import { Badge } from "@/components/ui/badge"
import { Leaf, Video, Mic, Sparkles } from "lucide-react"
import { VideoFile, GeneratedScript} from "@/types/video"
import Link from "next/link"

export default function ContentRemixTool() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedVideos, setUploadedVideos] = useState<VideoFile[]>([])
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    { id: 1, title: "Upload Videos", icon: Video, description: "Upload TikTok videos for analysis" },
    { id: 2, title: "Extract Insights", icon: Sparkles, description: "AI transcription and key insights" },
    { id: 3, title: "Generate Script", icon: Leaf, description: "Create new agricultural content" },
    { id: 4, title: "Voiceover & Preview", icon: Mic, description: "Generate voiceover and preview" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Link href="/" className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">AgriContent AI</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered tool to remix and localize agricultural content for Southeast Asian farmers
          </p>
        </Link>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      isActive
                        ? "bg-green-600 border-green-600 text-white"
                        : isCompleted
                          ? "bg-green-100 border-green-600 text-green-600"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-4 ${isCompleted ? "bg-green-600" : "bg-gray-300"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Indicator */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="text-sm">
            Step {currentStep}: {steps[currentStep - 1].title}
          </Badge>
          <p className="text-gray-600 mt-2">{steps[currentStep - 1].description}</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <VideoUpload
              onVideosUploaded={setUploadedVideos}
              onNext={() => setCurrentStep(2)}
              uploadedVideos={uploadedVideos}
            />
          )}

          {currentStep === 2 && (
            <TranscriptionResults
              videos={uploadedVideos}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
              setIsProcessing={setIsProcessing}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 3 && (
            <ScriptGeneration
              videos={uploadedVideos}
              onScriptGenerated={setGeneratedScript}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
              generatedScript={generatedScript}
            />
          )}

          {currentStep === 4 && generatedScript && (
            <VoiceoverPreview script={generatedScript} onBack={() => setCurrentStep(3)} />
          )}
        </div>
      </div>
    </div>
  )
}
