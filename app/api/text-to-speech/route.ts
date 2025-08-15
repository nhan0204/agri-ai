import { type NextRequest, NextResponse } from "next/server"
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, languageCode } = await request.json()

    if (!text || !voiceId || !languageCode) {
      return NextResponse.json({ error: "Text, LanguageCode and voiceId are required" }, { status: 400 })
    }


    console.log(`Generating TTS for voice: ${voiceId} (${voiceId})`)

    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text: text,
      modelId: "eleven_flash_v2_5",
      outputFormat: "mp3_44100_128",
      // languageCode: languageCode
    })

    // Convert audio stream to buffer
    const chunks: Uint8Array[] = []
    const reader = audio.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const audioBuffer = Buffer.concat(chunks)

    // Return audio as blob
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Content-Disposition": 'attachment; filename="voiceover.mp3"',
      },
    })
  } catch (error: any) {
    console.error("ElevenLabs TTS error:", error)

    // Handle rate limit or quota exceeded
    if (error.message?.includes("quota") || error.message?.includes("limit")) {
      return NextResponse.json(
        {
          error: "TTS quota exceeded",
          details: "ElevenLabs API quota has been reached. Please try again later.",
          fallback: true,
        },
        { status: 429 },
      )
    }

    return NextResponse.json({ error: "Failed to generate voiceover", details: error.message }, { status: 500 })
  }
}