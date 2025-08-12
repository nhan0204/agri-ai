import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { tmpdir } from "os"
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { extractAgriculturalInsights } from "@/lib/extract-insights"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const audio = form.get("audio") as File | null
    const optionsStr = form.get("options") as string | null
    const options = optionsStr ? JSON.parse(optionsStr) : {}

    if (!audio) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
    }

    const tempDir = tmpdir()
    const audioPath = path.join(tempDir, `audio_${Date.now()}.wav`)
    const audioBuffer = await audio.arrayBuffer()
    await fs.writeFile(audioPath, Buffer.from(audioBuffer))

    const transcriptionResult = await transcribeAudioWithElevenLabs(audioPath, options)

    const insights = extractAgriculturalInsights(transcriptionResult.text)

    return NextResponse.json({
      ...transcriptionResult,
      keyInsights: insights,
    })
  } catch (error) {
    console.error("Transcription API error:", error)
    return NextResponse.json(
      { error: `Transcription failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}

async function transcribeAudioWithElevenLabs(audioPath: string, options: any = {}) {
  try {
    const elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    })

    const audioBuffer = await fs.readFile(audioPath)
    const audioBlob = new Blob([Uint8Array.from(audioBuffer)], { type: "audio/wav" })

    const transcription: any = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1",
      tagAudioEvents: true,
      languageCode: options.language || "eng",
      diarize: true,
    })

    console.log(transcription);

    await fs.unlink(audioPath).catch(console.error)

    return {
      text: transcription.text || "",
      segments: transcription.segments || [],
      language: options.language || "en",
      duration: transcription.duration || 0,
      speakers: transcription.speakers || [],
      audioEvents: transcription.audioEvents || [],
    }
  } catch (error) {
    await fs.unlink(audioPath).catch(console.error)
    throw error
  }
}