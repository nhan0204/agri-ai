"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Video, X,  ExternalLink, Loader2 } from "lucide-react"
import { extractVideoMetadata } from "@/lib/video-metadata"
import type { VideoFile } from "@/types/video"

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

  const isValidVideoFile = (file: File): boolean => {
    const validTypes = ["video/mp4", "video/mov", "video/avi", "video/quicktime", "video/x-msvideo"]
    return validTypes.includes(file.type)
  }

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => {
      if (!isValidVideoFile(file)) {
        alert(`${file.name} is not a supported video format. Please use MP4, MOV, or AVI files.`)
        return false
      }
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        alert(`${file.name} is too large. Please use files under 100MB.`)
        return false
      }
      return true
    })

    const newVideos: VideoFile[] = []

    for (const file of validFiles) {
      // Create object URL for video preview
      const videoUrl = URL.createObjectURL(file)

      // Create video element to get duration
      const video = document.createElement("video")
      video.preload = "metadata"

      const duration = await new Promise<number>((resolve) => {
        video.onloadedmetadata = () => {
          resolve(Math.floor(video.duration))
        }
        video.onerror = () => {
          resolve(60) // Default duration if can't read metadata
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

      if (metadata) {
        const newVideo: VideoFile = {
          id: Date.now().toString(),
          name: metadata.title,
          url: metadata.thumbnail || "/video-thumbnail.png",
          duration: metadata.duration,
          transcription: "Processing transcription...",
          keyInsights: ["Video analysis pending"],
          platform: metadata.platform,
          author: metadata.author,
        }
        onVideosUploaded([...uploadedVideos, newVideo])
        setUrl("")
      } else {
        // Fallback to mock data if metadata extraction fails
        const newVideo: VideoFile = {
          id: Date.now().toString(),
          name: `Video from URL`,
          url: "/video-thumbnail.png",
          duration: Math.floor(Math.random() * 60) + 30,
          transcription: "Processing transcription...",
          keyInsights: ["Video analysis pending"],
        }
        onVideosUploaded([...uploadedVideos, newVideo])
        setUrl("")
      }
    } catch (error) {
      console.error("Error processing video URL:", error)
      alert("Failed to process video URL. Please try again.")
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
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload  Videos
          </CardTitle>
          <CardDescription>Upload video files or provide  URLs to analyze and remix content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Drop Zone */}
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

          {/*  URL Input */}
          {/* Video URL Input */}
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

      {/* Uploaded Videos */}
      {uploadedVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Videos ({uploadedVideos.length})</CardTitle>
            <CardDescription>Videos ready for analysis and content remixing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedVideos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4 relative">
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
                      src={video.url || "/placeholder.svg"}
                      alt={video.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h4 className="font-medium text-sm mb-1">{video.name}</h4>
                  <p className="text-xs text-gray-500">{video.duration}s duration</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={uploadedVideos.length === 0} size="lg">
          Analyze Videos
        </Button>
      </div>
    </div>
  )
}
