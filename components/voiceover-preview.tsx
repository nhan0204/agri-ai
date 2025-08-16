"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mic, Play, Pause, Download, Volume2, User, Clock } from "lucide-react"
import type { GeneratedScript } from "@/types/video"
import {
  AVAILABLE_VOICES,
  generateSpeech,
  downloadAudio,
  estimateAudioDuration,
} from "@/lib/speech-generator"
import { SpeechResult } from "@/types/speech"
import { useIsMobile } from "@/hooks/use-mobile"

interface VoiceoverPreviewProps {
  script: GeneratedScript
  onBack: () => void
  onNext: () => void
  speechResult: SpeechResult | null
  setSpeechResult: (result: SpeechResult | null) => void
}

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function VoiceoverPreview({ script, onBack, onNext, speechResult, setSpeechResult }: VoiceoverPreviewProps) {
  const [selectedVoice, setSelectedVoice] = useState("kael-filipino")
  const [speed, setSpeed] = useState([1.0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentProgress, setCurrentProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const voiceoverGenerated = useMemo(() => {
    return speechResult?.success && speechResult?.audioUrl
  }, [speechResult])

  const audioUrl = speechResult?.audioUrl || null

  const voices = AVAILABLE_VOICES

  const handleGenerateVoiceover = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateSpeech(script.script, {
        voiceId: selectedVoice,
        language: script.language,
        speed: speed[0], // Use the first value from the slider array
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to generate voiceover")
      }

      setSpeechResult(result)

      if (audioRef.current) {
        audioRef.current.src = result.audioUrl
      }
    } catch (error: any) {
      console.error("Voiceover generation error:", error)
      setError(error.message || "Failed to generate voiceover")
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setCurrentProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('error', handleAudioError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.removeEventListener('error', handleAudioError);
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    setCurrentProgress(100);
  }

  const handleAudioError = () => {
    setError("Failed to play audio")
    setIsPlaying(false)
  }

  const handleDownloadAudio = () => {
    if (!audioUrl) return

    const filename = `${script.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_voiceover.mp3`
    downloadAudio(audioUrl, filename)
  }

  const selectedVoiceData = voices.find((v) => v.id === selectedVoice)
  const estimatedDuration = speechResult?.duration || estimateAudioDuration(script.script)

  return (
    <div className="space-y-6">
      <audio ref={audioRef} style={{ display: "none" }} />

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
                <SelectValue placeholder="Select a voice">
                  {selectedVoiceData && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedVoiceData.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedVoiceData.gender}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {selectedVoiceData.language} • {selectedVoiceData.accent}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{voice.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {voice.gender}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {voice.language} • {voice.accent}
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
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">{selectedVoiceData.name}</h4>
                  <p className="text-sm text-blue-700">
                    {selectedVoiceData.language} • {selectedVoiceData.accent} • {selectedVoiceData.gender}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">{selectedVoiceData.culturalFit}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Speaking Speed: {speed[0]}x</Label>
            <Slider value={speed} onValueChange={setSpeed} max={1.2} min={0.7} step={0.1} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Slower (0.7x)</span>
              <span>Normal (1.0x)</span>
              <span>Faster (1.2x)</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

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

      {voiceoverGenerated && audioUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Voiceover</CardTitle>
            <CardDescription>Your AI-generated voiceover is ready for preview and download</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      {script.title} - {speechResult?.voiceUsed || selectedVoiceData?.name}
                    </span>
                    <span className="text-sm text-gray-500">{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-[width] duration-300 ease-linear"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleDownloadAudio}>
              <Download className="h-4 w-4 mr-2" />
              Download Audio (MP3)
            </Button>

          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {useIsMobile() ? "" : "Back to script"}
        </Button>
        
        <Button onClick={onNext} disabled={!voiceoverGenerated} size="lg">
          Generate Mix Video
        </Button>
      </div>
    </div>
  )
}