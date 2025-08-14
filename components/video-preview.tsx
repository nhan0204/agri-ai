"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Play, Loader2, ArrowLeft } from "lucide-react"
import type { VideoFile } from "@/types/video"
import type { SpeechResult } from "@/lib/speech-generator"
import { generateMixedVideo } from "@/lib/video-generator"

interface VideoPreviewProps {
  videos: VideoFile[]
  speechResult: SpeechResult | null
  onBack: () => void
  apiKey: string
}

export function VideoPreview({ videos, speechResult, onBack, apiKey }: VideoPreviewProps) {
  const [renderId, setRenderId] = useState<string | null>(null)
  const [statusUrl, setStatusUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("idle")
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateVideo = async () => {
    setError(null)
    setStatus("generating")
    try {
      const { renderId, statusUrl } = await generateMixedVideo(videos, speechResult, apiKey)
      setRenderId(renderId)
      setStatusUrl(statusUrl)
      setStatus("waiting")
    } catch (err: any) {
      console.error("Video generation error:", err)
      setError(err.message || "Failed to generate video")
      setStatus("error")
    }
  }

  // Poll Shotstack for completion if statusUrl exists
  useEffect(() => {
    if (!statusUrl || status !== "waiting") return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(statusUrl, { headers: { "x-api-key": apiKey } })
        if (!res.ok) throw new Error("Failed to fetch render status")

        const data = await res.json()
        const renderStatus = data?.response?.status
        if (renderStatus === "done") {
          setVideoUrl(data?.response?.url || null)
          setStatus("done")
          clearInterval(interval)
        } else if (renderStatus === "failed") {
          setStatus("error")
          setError("Video rendering failed")
          clearInterval(interval)
        }
      } catch (err: any) {
        console.error("Status polling error:", err)
        setStatus("error")
        setError(err.message)
        clearInterval(interval)
      }
    }, 5000) // poll every 5s

    return () => clearInterval(interval)
  }, [statusUrl, apiKey, status])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Final Video Export</CardTitle>
          <CardDescription>Combine clips & optional voiceover into one export</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "idle" && (
            <Button className="w-full" onClick={handleGenerateVideo}>
              Generate Video
            </Button>
          )}

          {status === "generating" && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Sending request to renderer...</span>
            </div>
          )}

          {status === "waiting" && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Rendering in progress... (this may take a while)</span>
            </div>
          )}

          {status === "done" && videoUrl && (
            <div className="space-y-4">
              <video controls className="w-full rounded-lg">
                <source src={videoUrl} type="video/mp4" />
              </video>
              <Button asChild className="w-full">
                <a href={videoUrl} download>
                  <Download className="h-4 w-4 mr-2" /> Download Video
                </a>
              </Button>
            </div>
          )}

          {status === "error" && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
    </div>
  )
}
