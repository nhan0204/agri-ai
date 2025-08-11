"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Video, X, ExternalLink, Loader2 } from "lucide-react"
import { extractVideoMetadata } from "@/lib/video-metadata"
import type { VideoFile } from "@/types/video"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface VideoUploadProps {
  onVideosUploaded: (videos: VideoFile[]) => void
  onNext: () => void
  uploadedVideos: VideoFile[]
}

export function VideoUpload({ onVideosUploaded, onNext, uploadedVideos }: VideoUploadProps) {
  const [url, setUrl] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessingUrl, setIsProcessingUrl] = useState(false)
  const { toast } = useToast()

  const isValidVideoFile = (file: File): boolean => {
    const validTypes = ["video/mp4", "video/mov", "video/avi", "video/quicktime", "video/x-msvideo"]
    return validTypes.includes(file.type)
  }

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => {
      if (!isValidVideoFile(file)) {
        toast({
          title: "Invalid File Format",
          description: `${file.name} is not a supported video format. Please use MP4, MOV, or AVI files.`,
          variant: "destructive",
        })
        return false
      }
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is too large. Please use files under 100MB.`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    const newVideos: VideoFile[] = []

    for (const file of validFiles) {
      const videoUrl = URL.createObjectURL(file)
      const video = document.createElement("video")
      video.preload = "metadata"

      const duration = await new Promise<number>((resolve) => {
        video.onloadedmetadata = () => {
          resolve(Math.floor(video.duration))
        }
        video.onerror = () => {
          resolve(60)
        }
        video.src = videoUrl
      })

      const newVideo: VideoFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        url: videoUrl,
        duration: duration,
        transcription: "Processing transcription...",
        keyInsights: ["Video analysis pending"],
      }

      newVideos.push(newVideo)
    }

    if (newVideos.length > 0) {
      onVideosUploaded([...uploadedVideos, ...newVideos])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files)
    }
  }

  const handleAddUrl = async () => {
    if (!url.trim()) return

    setIsProcessingUrl(true)

    try {
      const metadata = await extractVideoMetadata(url)
      console.log('metadata', metadata)

      if (!metadata) {
        toast({
          title: "Invalid URL",
          description: "Invalid video URL. Please try again with a valid TikTok or YouTube URL.",
          variant: "destructive",
        })
        return
      }

      if (metadata.duration > 60) {
        toast({
          title: "Invalid URL",
          description: "Video too long duration must be within 1 minute.",
          variant: "destructive",
        })
        return
      }

      const newVideo: VideoFile = {
        id: Date.now().toString(),
        name: metadata.title,
        url: url,
        thumbnail: metadata.thumbnail || "/video-thumbnail.png",
        duration: metadata.duration,
        transcription: "Processing transcription...",
        keyInsights: ["Video analysis pending"],
        platform: metadata.platform,
        author: metadata.author,
      }
      onVideosUploaded([...uploadedVideos, newVideo])
      setUrl("")
    } catch (error) {
      console.error("Error processing video URL:", error)
      toast({
        title: "Error",
        description: "Failed to process video URL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingUrl(false)
    }
  }

  const removeVideo = (id: string) => {
    const updatedVideos = uploadedVideos.filter((video) => video.id !== id)
    onVideosUploaded(updatedVideos)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileUpload(files)
      }
    },
    [uploadedVideos],
  )

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Videos
          </CardTitle>
          <CardDescription>Upload video files or provide URLs to analyze and remix content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop video files here or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">Supports MP4, MOV, AVI files up to 100MB</p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  handleBrowseClick()
                }}
                className="bg-transparent"
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/mov,video/avi,video/quicktime,video/x-msvideo"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="space-y-2">
            <Label htmlFor="video-url">Or paste TikTok/YouTube URL</Label>
            <div className="flex gap-2">
              <Input
                id="video-url"
                placeholder="https://www.tiktok.com/@username/video/... or https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isProcessingUrl}
              />
              <Button onClick={handleAddUrl} disabled={!url.trim() || isProcessingUrl}>
                {isProcessingUrl ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                {isProcessingUrl ? "Processing..." : "Add"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Videos ({uploadedVideos.length})</CardTitle>
            <CardDescription>Videos ready for analysis and content remixing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
              {uploadedVideos.map((video) => (
                <Link href={video.url} key={video.id} className="border rounded-lg p-4 relative hover:opacity-70 scale-100 hover:scale-105 transform transition-all">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => removeVideo(video.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {video.url.startsWith("blob:") ? (
                    <video src={video.url} className="w-full h-32 object-cover rounded mb-3" controls={false} muted />
                  ) : (
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h4 className="font-medium text-sm mb-1">{video.name}</h4>
                  <p className="text-xs text-gray-500">{video.duration}s duration</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={uploadedVideos.length === 0} size="lg">
          Analyze Videos
        </Button>
      </div>
    </div>
  )
}