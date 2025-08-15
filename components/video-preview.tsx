"use client"

import { useState, useEffect } from "react"
import { Download, Loader2, ArrowLeft } from "lucide-react"
import type { VideoFile } from "@/types/video"
import { generateMixedVideo, checkRenderStatus, downloadVideo } from "@/lib/video-generator"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SpeechResult } from "@/types/speech"
import { useIsMobile } from "@/hooks/use-mobile"

interface VideoPreviewProps {
  videos: VideoFile[]
  speechResult: SpeechResult | null
  onBack: () => void
}

export function VideoPreview({ videos, speechResult, onBack }: VideoPreviewProps) {
  const [renderId, setRenderId] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "generating" | "waiting" | "done" | "error">("idle")
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Polling when waiting for render completion
  useEffect(() => {
    if (status === "waiting" && renderId) {
      const interval = setInterval(async () => {
        try {
          const url = await checkRenderStatus(renderId)
          if (url) {
            setVideoUrl(url)
            setStatus("done")
            clearInterval(interval)
          }

          console.log("Video has been rendered: ", url);
        } catch (err) {
          console.error("Polling error:", err)
        }
      }, 5000) // every 5s

      return () => clearInterval(interval)
    }
  }, [status, renderId])

  const handleGenerateVideo = async () => {
    setError(null)
    setStatus("generating")
    try {
      const { renderId, videoUrl } = await generateMixedVideo(videos, speechResult)
      setRenderId(renderId)

      if (videoUrl) {
        // Render finished immediately
        setVideoUrl(videoUrl)
        setStatus("done")

        console.log("Video render succefully: ", videoUrl);

      } else {
        // Render still processing
        setStatus("waiting")
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate video")
      setStatus("error")
    }
  }

  const handleDownloadVideo = () => {
    if (!videoUrl || !renderId) return

    const filename = `${renderId.toLowerCase()}_video.mp4`
    downloadVideo(videoUrl, filename)
  }

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
              <span>Rendering in progress... Please wait...</span>
            </div>
          )}

          {status === "done" && videoUrl && (
            <div className="space-y-4">
              <video
                controls
                playsInline
                className="w-full rounded-lg aspect-[9/16] object-cover"
                onError={() => {
                  setError("Failed to load video")
                  setStatus("error")
                }}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleDownloadVideo}>
                <Download className="h-4 w-4 mr-2" />
                Download Video (MP4)
              </Button>
            </div>
          )}

          {status === "error" && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {useIsMobile() ? "" : "Back to generate voiceover"}
        </Button>
      </div>
    </div>
  )
}
