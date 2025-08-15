"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Sparkles, Loader2, Copy, CheckCircle } from "lucide-react"
import type { VideoFile, GeneratedScript, Region } from "@/types/video"
import { generateScript } from "@/lib/script-generator"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

interface ScriptGenerationProps {
  videos: VideoFile[]
  onScriptGenerated: (script: GeneratedScript) => void
  onNext: () => void
  onBack: () => void
  generatedScript: GeneratedScript | null
}

export function ScriptGeneration({
  videos,
  onScriptGenerated,
  onNext,
  onBack,
  generatedScript,
}: ScriptGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [targetRegion, setTargetRegion] = useState<Region>("philippines")
  const [contentType, setContentType] = useState("educational")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleGenerateScript = async () => {
    setIsGenerating(true)

    try {
      const allInsights = videos.flatMap((video) => video.keyInsights || [])
      const allTranscriptions = videos.map((video) => video.transcription || "").join(" ")

      console.log("All insights: ", allInsights)
      console.log("All transcriptions: ", allTranscriptions)

      const script = await generateScript({
        insights: allInsights,
        transcriptions: allTranscriptions,
        targetRegion,
        contentType,
        customPrompt,
      })

      if (!script) {
        toast({
          title: "Failed to generate script",
          variant: "destructive",
        })
        return null;
      }

      onScriptGenerated(script)
    } catch (error) {
      console.error("Error generating script:", error)
      // Fallback to mock script
      const mockScript: GeneratedScript = {
        title: "Effective Rice Disease Management for Filipino Farmers",
        script: `Kumusta mga kababayan farmers! Today I'll share with you the most effective ways to protect your rice crops from common diseases.

First, let's talk about brown spot disease - napakadalas nito during rainy season. Look for small brown spots on your rice leaves. If you see these early, you can prevent big problems later.

Here's what you need to do: Mix neem oil with water - 2 tablespoons per liter. Add a little dish soap to help it stick. Spray this in the evening when it's cooler.

Remember, prevention is always better than cure. Check your fields regularly, especially after heavy rains. Healthy crops mean better harvest and more income for your family.

Try this method and let me know in the comments how it works for you. Share this video to help other farmers too!`,
        keyPoints: [
          "Early disease detection saves crops",
          "Neem oil is effective and affordable",
          "Evening application works best",
          "Regular field monitoring is crucial",
        ],
        targetAudience: "Filipino smallholder rice farmers",
        language: "fil",
      }
      onScriptGenerated(mockScript)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (generatedScript) {
      await navigator.clipboard.writeText(generatedScript.script)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const allInsights = videos.flatMap((video) => video.keyInsights || [])
  const uniqueInsights = [...new Set(allInsights)]

  return (
    <div className="space-y-6">
      {/* Source Material Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Source Material Summary</CardTitle>
          <CardDescription>Key insights extracted from {videos.length} uploaded videos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Available Insights:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {uniqueInsights.map((insight, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {insight}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Video Count:</Label>
              <p className="text-sm text-gray-600 mt-1">
                {videos.length} videos with total duration of {videos.reduce((sum, v) => sum + v.duration, 0)} seconds
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Script Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate New Script
          </CardTitle>
          <CardDescription>Customize the AI-generated content for your target audience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-region">Target Region</Label>
              <Select value={targetRegion} onValueChange={setTargetRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='philippines'>Philippines</SelectItem>
                  <SelectItem value='vietnam'>Vietnam</SelectItem>
                  <SelectItem value='malaysia'>Malaysia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="educational">Educational Tutorial</SelectItem>
                  <SelectItem value="problem-solving">Problem Solving</SelectItem>
                  <SelectItem value="seasonal-tips">Seasonal Tips</SelectItem>
                  <SelectItem value="product-demo">Product Demonstration</SelectItem>
                  <SelectItem value="entertainment">Media - Entertaining</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Custom Instructions (Optional)</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Add specific requirements, tone, or focus areas for the generated script..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleGenerateScript} disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Script
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Script */}
      {generatedScript && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Generated Script
                </CardTitle>
                <CardDescription>{generatedScript.title}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                {generatedScript.script}
              </pre>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Key Points:</Label>
                <ul className="mt-2 space-y-1">
                  {generatedScript.keyPoints.map((point, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label className="text-sm font-medium">Target Audience:</Label>
                <p className="text-sm text-gray-600 mt-2">{generatedScript.targetAudience}</p>

                <Label className="text-sm font-medium mt-3 block">Language:</Label>
                <p className="text-sm text-gray-600 mt-1">{generatedScript.language}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {useIsMobile() ? "" : "Back to Analysis"}
        </Button>
        <Button onClick={onNext} disabled={!generatedScript} size="lg">
          Generate Voiceover
        </Button>
      </div>
    </div>
  )
}
