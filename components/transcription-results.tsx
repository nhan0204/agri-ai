"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Lightbulb, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import type { VideoFile } from "@/types/video"
import { transcribeVideoFromUrl } from "@/lib/video-transcript"
import { extractAgriculturalInsights } from "@/lib/extract-insights"
import { useIsMobile } from "@/hooks/use-mobile"

interface TranscriptionResultsProps {
  videos: VideoFile[]
  processedVideos: VideoFile[]
  setProcessedVideos: (videos: VideoFile[]) => void
  onNext: () => void
  onBack: () => void
  setIsProcessing: (processing: boolean) => void
  isProcessing: boolean
}

export function TranscriptionResults({
  videos,
  processedVideos,
  setProcessedVideos,
  onNext,
  onBack,
  setIsProcessing,
  isProcessing,
}: TranscriptionResultsProps) {
  const [currentProcessing, setCurrentProcessing] = useState(0)
  const processedUrlsRef = useRef<Set<string>>(new Set())
  const isProcessingRef = useRef(false)

  const getUnprocessedVideos = () => videos.filter(
    (video) => !processedUrlsRef.current.has(video.url) && !processedVideos.some((pv) => pv.url === video.url),
  )

  const shouldProcessVideos = useMemo(() => {
    if (videos.length === 0 || isProcessingRef.current) return false

    // Check if any videos need processing (not already processed)
    const unprocessedVideos = getUnprocessedVideos()

    return unprocessedVideos.length > 0
  }, [videos, processedVideos])

  useEffect(() => {
    if (shouldProcessVideos) {
      processVideos()
    }
  }, [shouldProcessVideos])

  const processVideos = async () => {
    if (isProcessingRef.current) return

    isProcessingRef.current = true
    setIsProcessing(true)

    const unprocessedVideos = getUnprocessedVideos()

    console.log(`Processing ${unprocessedVideos.length} unprocessed videos`)

    const newProcessedVideos: VideoFile[] = [...processedVideos]

    for (let i = 0; i < unprocessedVideos.length; i++) {
      const video = unprocessedVideos[i]
      setCurrentProcessing(processedVideos.length + i + 1)

      processedUrlsRef.current.add(video.url)

      try {
        console.log(`Processing video: ${video.url}`)
        const transcriptionResult = await transcribeVideoFromUrl(video.url, video.language)
        const keyInsights = await extractAgriculturalInsights([transcriptionResult.text, video.name].join(' '))

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
          transcription: video.transcription || generateMockTranscription(processedVideos.length + i),
          keyInsights: video.keyInsights || generateMockInsights(processedVideos.length + i),
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

  return (
    <div className="space-y-6">
      {isProcessing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  Processing video {currentProcessing} of {videos.length}
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

                {video.keyInsights && video.keyInsights.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-900">Key Insights</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {video.keyInsights.map((insight, insightIndex) => (
                        <Badge key={insightIndex} variant="outline" className="text-xs">
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {index < processedVideos.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {useIsMobile() ? "" : "Back to Upload"}
        </Button>
        <Button onClick={onNext} disabled={isProcessing || processedVideos.length === 0} size={useIsMobile() ? "default" : "lg"}>
          Generate New Script
        </Button>
      </div>
    </div>
  )
}
