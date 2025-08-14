import { SpeechOptions, SpeechResult, VoiceOption } from "@/types/speech"

// Available voices with ElevenLabs voice IDs
export const AVAILABLE_VOICES: VoiceOption[] = [
  {
    id: "kael-filipino",
    name: "Kael",
    accent: "Provincial",
    gender: "male" as const,
    elevenLabsId: "53HEM9cpXMMsKDVvXwHV",
    culturalFit: "Youthful tone, male voice with smooth charming tone",
    language: "fil",
  },
  {
    id: "ninh-vietnamese",
    name: "Ninh Don",
    accent: "Northern",
    gender: "male" as const,
    elevenLabsId: "aN7cv9yXNrfIR87bDmyD",
    culturalFit: "Funny tone, male voice for entertainment and media",
    language: "vi",
  },
  {
    id: "athira-malay",
    name: "Athira",
    accent: "Penang",
    gender: "female" as const,
    elevenLabsId: "BeIxObt4dYBRJLYoe1hU",
    culturalFit: "Northern Malaysian accent, warm voice easy to connect",
    language: "ms",
  },
]

/**
 * Generate speech from text using ElevenLabs API
 */
export async function generateSpeech(text: string, options: SpeechOptions = {}): Promise<SpeechResult> {
  try {
    // Default options
    const defaultOptions: SpeechOptions = {
      voiceId: "boses-batibot",
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_44100_128",
      language: "en",
    }

    const finalOptions = { ...defaultOptions, ...options }

    // Find the voice configuration
    const voice = AVAILABLE_VOICES.find((v) => v.id === finalOptions.voiceId) || AVAILABLE_VOICES[0]
    const language = finalOptions.language || voice.language

    // Call the API route
    const response = await fetch("/api/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
        voiceId: voice.elevenLabsId,
        modelId: finalOptions.modelId,
        outputFormat: finalOptions.outputFormat,
        languageCode: language, // Use language as languageCode for API
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate speech")
    }

    // Get audio as blob and create URL
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    // Estimate duration
    const estimatedDuration = text.trim().split(/\s+/).length / 150 * 60

    return {
      audioUrl,
      duration: Math.ceil(estimatedDuration),
      voiceUsed: voice.name,
      success: true,
    }
  } catch (error) {
    console.error("Speech generation error:", error)
    return {
      audioUrl: "",
      duration: 0,
      voiceUsed: options.voiceId || "Unknown",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Download audio file
 */
export function downloadAudio(audioUrl: string, filename = "generated-speech.mp3"): void {
  const link = document.createElement("a")
  link.href = audioUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Estimate audio duration based on text length
 */
export function estimateAudioDuration(text: string): number {
  const wordsPerMinute = 150
  const wordCount = text.trim().split(/\s+/).length
  const durationMinutes = wordCount / wordsPerMinute
  return Math.ceil(durationMinutes * 60)
}