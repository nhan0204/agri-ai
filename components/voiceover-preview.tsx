"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mic, Play, Pause, Download, Volume2, User, Clock } from "lucide-react"
import type { GeneratedScript } from "@/app/demo/page"

interface VoiceoverPreviewProps {
  script: GeneratedScript
  onBack: () => void
}

export function VoiceoverPreview({ script, onBack }: VoiceoverPreviewProps) {
  const [selectedVoice, setSelectedVoice] = useState("maria-filipino")
  const [speed, setSpeed] = useState([1.0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [voiceoverGenerated, setVoiceoverGenerated] = useState(false)

  const voices = [
    { id: "maria-filipino", name: "Maria", language: "Filipino", accent: "Manila", gender: "Female" },
    { id: "jose-filipino", name: "Jose", language: "Filipino", accent: "Cebu", gender: "Male" },
    { id: "anna-english", name: "Anna", language: "English", accent: "Philippine English", gender: "Female" },
    { id: "carlos-mixed", name: "Carlos", language: "Taglish", accent: "Mixed", gender: "Male" },
  ]

  const handleGenerateVoiceover = async () => {
    setIsGenerating(true)
    // Simulate voiceover generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setVoiceoverGenerated(true)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, control audio playback here
  }

  const selectedVoiceData = voices.find((v) => v.id === selectedVoice)
  const estimatedDuration = Math.ceil(script.script.length / 10) // Rough estimate

  return (
    <div className="space-y-6">
      {/* Script Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{script.title}</CardTitle>
          <CardDescription>Ready to generate AI voiceover for your agricultural content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{script.targetAudience}</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{script.language}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">~{estimatedDuration}s duration</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Selection & Settings
          </CardTitle>
          <CardDescription>Choose the perfect voice for your target audience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Voice Selection</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{voice.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {voice.gender}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {voice.language} - {voice.accent}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedVoiceData && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">{selectedVoiceData.name}</h4>
                  <p className="text-sm text-blue-700">
                    {selectedVoiceData.language} • {selectedVoiceData.accent} • {selectedVoiceData.gender}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Speaking Speed: {speed[0]}x</Label>
            <Slider value={speed} onValueChange={setSpeed} max={2} min={0.5} step={0.1} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Slower (0.5x)</span>
              <span>Normal (1.0x)</span>
              <span>Faster (2.0x)</span>
            </div>
          </div>

          <Button onClick={handleGenerateVoiceover} disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Mic className="h-4 w-4 mr-2 animate-pulse" />
                Generating Voiceover...
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Generate AI Voiceover
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Voiceover */}
      {voiceoverGenerated && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Voiceover</CardTitle>
            <CardDescription>Your AI-generated voiceover is ready for preview and download</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Audio Player Mockup */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayback}
                  className="w-12 h-12 rounded-full p-0 bg-transparent"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                </Button>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {script.title} - {selectedVoiceData?.name}
                    </span>
                    <span className="text-sm text-gray-500">0:00 / {estimatedDuration}s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: isPlaying ? "45%" : "0%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Video Preview Mockup */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Video Preview</Label>
              <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                <img src="/filipino-farmer-rice-text.png" alt="Video preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={togglePlayback}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                </div>

                {/* Subtitle overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-75 rounded px-3 py-2">
                    <p className="text-white text-sm text-center">
                      "Kumusta mga kababayan farmers! Today I'll share with you..."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download Audio (MP3)
              </Button>
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Video (MP4)
              </Button>
            </div>

            {/* Export Stats */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Export Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Duration:</span>
                  <span className="ml-2 font-medium">{estimatedDuration}s</span>
                </div>
                <div>
                  <span className="text-green-700">Voice:</span>
                  <span className="ml-2 font-medium">{selectedVoiceData?.name}</span>
                </div>
                <div>
                  <span className="text-green-700">Language:</span>
                  <span className="ml-2 font-medium">{script.language}</span>
                </div>
                <div>
                  <span className="text-green-700">Speed:</span>
                  <span className="ml-2 font-medium">{speed[0]}x</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Script
        </Button>
        {voiceoverGenerated && (
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export Final Video
          </Button>
        )}
      </div>
    </div>
  )
}
