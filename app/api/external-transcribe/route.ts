import { type NextRequest, NextResponse } from "next/server"
import { Supadata } from "@supadata/js"
import { extractAgriculturalInsights } from "@/lib/video-transcript"

export async function POST(request: NextRequest) {
  const { videoUrl, options = {} } = await request.json()

  try {
    if (!process.env.SUPADATA_API_KEY) {
      return NextResponse.json({ error: "Supadata API key not configured" }, { status: 500 })
    }

    // Initialize Supadata client
    const supadata = new Supadata({
      apiKey: process.env.SUPADATA_API_KEY,
    })

    // Get transcript from any supported platform (YouTube, TikTok, Instagram, X)
    const transcriptResult = await supadata.transcript({
      url: videoUrl,
      lang: options.language || "en",
      text: false, // Get timestamped chunks instead of plain text
      mode: "auto", // Auto-detect best transcription method
    })

    // Convert Supadata response to our TranscriptionResult format
    const result = convertSupadataResponse(transcriptResult, videoUrl)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Supadata transcription error:", error)

    if (error.message?.includes("Limit Exceeded") || error.message?.includes("limit-exceeded")) {
      console.log("API limit exceeded, returning mock transcription for:", videoUrl)
    }

    return NextResponse.json({ error: "Transcription failed" }, { status: 500 })
  }
}

function convertSupadataResponse(data: any, videoUrl: string) {
  // Handle different response formats from Supadata
  let segments = []
  let fullText = ""
  let language = "en"
  let duration = 0

  if (data.content && Array.isArray(data.content)) {
    // Format with timestamped content
    segments = data.content.map((item: any) => ({
      start: (item.offset || 0) / 1000, // Convert milliseconds to seconds
      end: ((item.offset || 0) + (item.duration || 0)) / 1000,
      text: item.text || "",
    }))

    fullText = data.content.map((item: any) => item.text || "").join(" ")
    language = data.lang || "en"
    duration = segments.length > 0 ? Math.max(...segments.map((s:any) => s.end)) : 0
  } else if (data.text) {
    // Plain text response
    fullText = data.text
    language = data.language || "en"
    // Create basic segments if no timing info available
    segments = [
      {
        start: 0,
        end: 30, // Default duration
        text: fullText,
      },
    ]
    duration = 30
  } else {
    throw new Error("Unexpected Supadata response format")
  }

  return {
    text: fullText,
    segments: segments,
    language: language,
    duration: duration,
    keyInsights: extractAgriculturalInsights(fullText),
  }
}
