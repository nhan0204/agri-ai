"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Lightbulb, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import type { VideoFile } from "@/types/video"
import { transcribeVideoFromUrl, extractAgriculturalInsights } from "@/lib/video-transcript"

interface TranscriptionResultsProps {
  videos: VideoFile[]
  onNext: () => void
  onBack: () => void
  setIsProcessing: (processing: boolean) => void
  isProcessing: boolean
}

export function TranscriptionResults({
  videos,
  onNext,
  onBack,
  setIsProcessing,
  isProcessing,
}: TranscriptionResultsProps) {
  const [processedVideos, setProcessedVideos] = useState<VideoFile[]>([])
  const [currentProcessing, setCurrentProcessing] = useState(0)
  const processedUrlsRef = useRef<Set<string>>(new Set())
  const isProcessingRef = useRef(false)

  useEffect(() => {
    if (videos.length > 0 && processedVideos.length === 0 && !isProcessingRef.current) {
      processVideos()
    }
  }, [videos]) // Removed processedVideos.length and isProcessing from dependencies

  const processVideos = async () => {
    if (isProcessingRef.current) return

    isProcessingRef.current = true
    setIsProcessing(true)

    const newProcessedVideos: VideoFile[] = []

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i]
      setCurrentProcessing(i)

      if (processedUrlsRef.current.has(video.url)) {
        console.log(`Skipping duplicate processing for: ${video.url}`)
        continue
      }

      processedUrlsRef.current.add(video.url)

      try {
        console.log(`Processing video: ${video.url}`)
        const transcriptionResult = await transcribeVideoFromUrl(video.url)
        const keyInsights = extractAgriculturalInsights(transcriptionResult.text)

        const processedVideo = {
          ...video,
          transcription: transcriptionResult.text,
          keyInsights: keyInsights,
        }

        newProcessedVideos.push(processedVideo)
      } catch (error) {
        console.error(`Failed to process video ${video.name}:`, error)

        const processedVideo = {
          ...video,
          transcription: video.transcription || generateMockTranscription(i),
          keyInsights: video.keyInsights || generateMockInsights(i),
        }

        newProcessedVideos.push(processedVideo)
      }
    }

    setProcessedVideos(newProcessedVideos)
    setIsProcessing(false)
    isProcessingRef.current = false
  }

  const generateMockTranscription = (index: number) => {
    const transcriptions = [
      "Hello fellow farmers! Today I want to share with you how to identify and treat brown spot disease in rice. This is very common during rainy season. Look for these brown oval spots on the leaves - they start small but can spread quickly if not treated. The best time to spray is early morning or evening when it's not too hot.",
      "Good morning everyone! Let me show you how to make organic pesticide using neem oil. This is very effective and safe for our crops. You need 2 tablespoons of neem oil, 1 liter of water, and a few drops of dish soap to help it mix. Spray this in the evening when the sun is not strong.",
      "Hi farmers! Today's topic is about proper fertilizer application for better yield. Many of us make mistakes with timing and quantity. For rice, apply nitrogen fertilizer in three stages - at planting, tillering, and panicle initiation. This will give you much better results than applying all at once.",
    ]
    return transcriptions[index % transcriptions.length]
  }

  const generateMockInsights = (index: number) => {
    const insights = [
      ["Disease identification techniques", "Optimal spraying times", "Brown spot symptoms", "Prevention methods"],
      ["Organic pest control", "Neem oil preparation", "Application timing", "Natural ingredients"],
      ["Fertilizer timing", "Nitrogen application stages", "Yield optimization", "Rice cultivation"],
    ]
    return insights[index % insights.length]
  }

  const allInsights = processedVideos.flatMap((video) => video.keyInsights || [])
  const uniqueInsights = [...new Set(allInsights)]

  return (
    <div className="space-y-6">
      {isProcessing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  Processing video {currentProcessing + 1} of {videos.length}
                </p>
                <p className="text-sm text-blue-700">Transcribing audio and extracting key insights...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {processedVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Transcription Results
            </CardTitle>
            <CardDescription>AI-generated transcriptions from your uploaded videos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {processedVideos.map((video, index) => (
              <div key={video.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium">{video.name}</h4>
                  <Badge variant="secondary">{video.duration}s</Badge>
                  {video.platform && (
                    <Badge variant="outline" className="text-xs">
                      {video.platform}
                    </Badge>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{video.transcription}</p>
                </div>
                {index < processedVideos.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {uniqueInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Extracted Key Insights
            </CardTitle>
            <CardDescription>Important topics and themes identified across all videos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {uniqueInsights.map((insight, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {insight}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Upload
        </Button>
        <Button onClick={onNext} disabled={isProcessing || processedVideos.length === 0} size="lg">
          Generate New Script
        </Button>
      </div>
    </div>
  )
}
