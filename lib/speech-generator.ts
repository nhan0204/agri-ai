export interface VoiceOption {
  id: string
  name: string
  language: string
  accent: string
  gender: "male" | "female"
  elevenLabsId: string
  culturalFit?: string
}

export interface SpeechOptions {
  voiceId?: string
  modelId?: string
  outputFormat?: string
  stability?: number
  similarityBoost?: number
  style?: number
  useSpeakerBoost?: boolean
}

export interface SpeechResult {
  audioUrl: string
  duration: number
  voiceUsed: string
  success: boolean
  error?: string
}

// Available voices with ElevenLabs voice IDs
export const AVAILABLE_VOICES: VoiceOption[] = [
  // Filipino Female Voices
  {
    id: "kael-filipino",
    name: "Kael",
    language: "Filipino",
    accent: "Provincial",
    gender: "male" as const,
    elevenLabsId: "53HEM9cpXMMsKDVvXwHV",
    culturalFit: "Youthful tone, male voice with smooth charming tone",
  },
  {
    id: "ninh-vietnamese",
    name: "Ninh Don",
    language: "Vietnamese",
    accent: "Northern",
    gender: "male" as const,
    elevenLabsId: "aN7cv9yXNrfIR87bDmyD",
    culturalFit: "Funny tone, male voice for entertainment and media",
  },
  {
    id: "athira-malay",
    name: "Athira",
    language: "Malaysian",
    accent: "Penang",
    gender: "female" as const,
    elevenLabsId: "BeIxObt4dYBRJLYoe1hU",
    culturalFit: "Northern Malaysian accent, warm voice easy to connect",
  },
]

// Regional voice mapping to one voice per region, removing bot-like voices
export const REGIONAL_VOICES = {
  philippines: {
    id: "kael-filipino",
    name: "Kael",
    language: "Filipino",
    accent: "Provincial",
    gender: "male" as const,
    elevenLabsId: "53HEM9cpXMMsKDVvXwHV",
    culturalFit: "Youthful tone, male voice with smooth charming tone",
  },
  vietnam: {
    id: "ninh-vietnamese",
    name: "Ninh Don",
    language: "Vietnamese",
    accent: "Northern",
    gender: "male" as const,
    elevenLabsId: "aN7cv9yXNrfIR87bDmyD",
    culturalFit: "Funny tone, male voice for entertainment and media",
  },
  malaysia: {
    id: "athira-malay",
    name: "Athira",
    language: "Malaysian",
    accent: "Penang",
    gender: "female" as const,
    elevenLabsId: "BeIxObt4dYBRJLYoe1hU",
    culturalFit: "Northern Malaysian accent, warm voice easy to connect",
  },
}

/**
 * Generate speech from text using ElevenLabs API
 */
export async function generateSpeech(text: string, options: SpeechOptions = {}): Promise<SpeechResult> {
  try {
    // Default options (unchanged)
    const defaultOptions: SpeechOptions = {
      voiceId: "boses-batibot",
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_44100_128",
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.0,
      useSpeakerBoost: false,
    }

    const finalOptions = { ...defaultOptions, ...options }

    // Find the voice configuration (unchanged)
    const voice = AVAILABLE_VOICES.find((v) => v.id === finalOptions.voiceId)
    if (!voice) {
      throw new Error(`Voice not found: ${finalOptions.voiceId}`)
    }

    // Call the API route (unchanged)
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
        voiceSettings: {
          stability: finalOptions.stability,
          similarity_boost: finalOptions.similarityBoost,
          style: finalOptions.style,
          use_speaker_boost: finalOptions.useSpeakerBoost,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate speech")
    }

    // On success: Get the audio as a blob and create a URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Estimate duration since the API doesn't return it
    const estimatedDuration = estimateAudioDuration(text);

    return {
      audioUrl,  // This is now a blob URL (e.g., 'blob:http://...')
      duration: estimatedDuration,
      voiceUsed: voice.name,
      success: true,
    }
  } catch (error) {
    console.error("Speech generation error:", error)

    return {
      audioUrl: "",
      duration: estimateAudioDuration(text),
      voiceUsed: options.voiceId || "Unknown",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Generate speech for agricultural content with optimized settings
 */
export async function generateAgriculturalSpeech(
  script: string,
  language: "filipino" | "english" = "filipino",
  gender: "male" | "female" = "female",
): Promise<SpeechResult> {
  // Select appropriate voice for agricultural content
  const voice =
    AVAILABLE_VOICES.find((v) => v.language.toLowerCase().includes(language) && v.gender === gender) ||
    AVAILABLE_VOICES[0]

  // Optimized settings for agricultural educational content
  const options: SpeechOptions = {
    voiceId: voice.id,
    modelId: "eleven_multilingual_v2",
    stability: 0.6, // Slightly more stable for educational content
    similarityBoost: 0.8, // Higher similarity for consistency
    style: 0.2, // Slight style for engagement
    useSpeakerBoost: true,
  }

  return generateSpeech(script, options)
}

/**
 * Batch generate speech for multiple scripts
 */
export async function generateBatchSpeech(
  scripts: Array<{ text: string; voiceId?: string }>,
  options: SpeechOptions = {},
): Promise<SpeechResult[]> {
  const results: SpeechResult[] = []

  for (const script of scripts) {
    const result = await generateSpeech(script.text, {
      ...options,
      voiceId: script.voiceId || options.voiceId,
    })
    results.push(result)

    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return results
}

/**
 * Estimate audio duration based on text length and speaking rate
 */
export function estimateAudioDuration(text: string): number {
  // Average speaking rate: ~150 words per minute for educational content
  const wordsPerMinute = 150
  const wordCount = text.trim().split(/\s+/).length
  const durationMinutes = wordCount / wordsPerMinute
  return Math.ceil(durationMinutes * 60) // Return duration in seconds
}

/**
 * Validate text for TTS generation
 */
export function validateTextForSpeech(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "Text cannot be empty" }
  }

  if (text.length > 5000) {
    return { valid: false, error: "Text too long (max 5000 characters)" }
  }

  // // Check for unsupported characters or formats
  // const hasOnlyValidChars = /^[\w\s.,!?;:()\-'"]+$/u.test(text)
  // if (!hasOnlyValidChars) {
  //   return { valid: false, error: "Text contains unsupported characters" }
  // }

  return { valid: true }
}

/**
 * Get voice by ID
 */
export function getVoiceById(voiceId: string): VoiceOption | undefined {
  return AVAILABLE_VOICES.find((voice) => voice.id === voiceId)
}

/**
 * Get voices by language
 */
export function getVoicesByLanguage(language: string): VoiceOption[] {
  return AVAILABLE_VOICES.filter((voice) => voice.language.toLowerCase().includes(language.toLowerCase()))
}

/**
 * Convert audio blob to downloadable URL
 */
export function createAudioDownloadUrl(audioBlob: Blob, filename = "speech.mp3"): string {
  const url = URL.createObjectURL(audioBlob)
  return url
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
 * Fetch available voices from ElevenLabs API
 */
export async function fetchAvailableVoices(): Promise<any[]> {
  try {
    const response = await fetch("/api/text-to-speech/voices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch voices")
    }

    const data = await response.json()
    return data.voices || []
  } catch (error) {
    console.error("Error fetching voices:", error)
    return []
  }
}

/**
 * Get Southeast Asian female voices from available voices
 */
export function getSeaFemaleVoices(availableVoices: any[]): VoiceOption[] {
  const seaKeywords = [
    "filipino",
    "tagalog",
    "cebuano",
    "bisaya",
    "indonesian",
    "bahasa",
    "javanese",
    "malaysian",
    "malay",
    "tamil",
    "vietnamese",
    "thai",
    "burmese",
    "khmer",
    "boses",
    "ate",
    "maya",
    "tala",
    "sikedewi",
    "nova",
    "afifah",
  ]

  return availableVoices
    .filter((voice: any) => {
      const name = voice.name?.toLowerCase() || ""
      const description = voice.description?.toLowerCase() || ""
      const labels = voice.labels?.join(" ").toLowerCase() || ""

      // Check if voice is female and matches SEA keywords
      const isFemale =
        voice.gender === "female" ||
        name.includes("female") ||
        description.includes("female") ||
        name.includes("ate") ||
        name.includes("nanay") ||
        name.includes("tita")

      const isSeaVoice = seaKeywords.some(
        (keyword) => name.includes(keyword) || description.includes(keyword) || labels.includes(keyword),
      )

      return isFemale && isSeaVoice
    })
    .map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      language: detectLanguageFromVoice(voice),
      accent: detectAccentFromVoice(voice),
      gender: "female" as const,
      elevenLabsId: voice.voice_id,
    }))
}

/**
 * Detect language from voice metadata
 */
function detectLanguageFromVoice(voice: any): string {
  const name = voice.name?.toLowerCase() || ""
  const description = voice.description?.toLowerCase() || ""

  if (name.includes("filipino") || name.includes("tagalog") || name.includes("ate") || name.includes("boses")) {
    return "Filipino"
  }
  if (name.includes("indonesian") || name.includes("bahasa") || name.includes("sikedewi")) {
    return "Indonesian"
  }
  if (name.includes("malaysian") || name.includes("malay")) {
    return "Malaysian"
  }
  if (name.includes("vietnamese")) {
    return "Vietnamese"
  }
  if (name.includes("thai")) {
    return "Thai"
  }

  return "English"
}

/**
 * Detect accent from voice metadata
 */
function detectAccentFromVoice(voice: any): string {
  const name = voice.name?.toLowerCase() || ""
  const description = voice.description?.toLowerCase() || ""

  if (name.includes("manila") || description.includes("manila")) return "Manila"
  if (name.includes("cebu") || description.includes("cebu")) return "Cebu"
  if (name.includes("davao") || description.includes("davao")) return "Davao"
  if (name.includes("jakarta") || description.includes("jakarta")) return "Jakarta"
  if (name.includes("bali") || description.includes("bali")) return "Bali"
  if (name.includes("kuala lumpur") || description.includes("kuala lumpur")) return "Kuala Lumpur"
  if (name.includes("penang") || description.includes("penang")) return "Penang"

  return "Standard"
}

export function getBestVoiceForRegion(region: keyof typeof REGIONAL_VOICES): VoiceOption {
  const regionalVoice = REGIONAL_VOICES[region]
  if (!regionalVoice) {
    // Fallback to first available voice
    return AVAILABLE_VOICES[0]
  }

  // Return the single voice for the region
  return regionalVoice
}

export async function generateRegionalAgriculturalSpeech(
  script: string,
  region: keyof typeof REGIONAL_VOICES,
  options: Partial<SpeechOptions> = {},
): Promise<SpeechResult> {
  const voice = getBestVoiceForRegion(region)

  // Region-specific optimizations
  const regionSettings = {
    philippines: { stability: 0.7, similarityBoost: 0.8, style: 0.3 }, // More expressive for Taglish
    vietnam: { stability: 0.8, similarityBoost: 0.75, style: 0.1 }, // More stable for tonal language
    thailand: { stability: 0.8, similarityBoost: 0.75, style: 0.1 }, // More stable for tonal language
    indonesia: { stability: 0.6, similarityBoost: 0.8, style: 0.2 }, // Balanced for Indonesian
    malaysia: { stability: 0.7, similarityBoost: 0.8, style: 0.25 }, // Slightly expressive for mixed language
  }

  const settings = regionSettings[region]

  const speechOptions: SpeechOptions = {
    voiceId: voice.id,
    modelId: "eleven_multilingual_v2",
    stability: settings.stability,
    similarityBoost: settings.similarityBoost,
    style: settings.style,
    useSpeakerBoost: true,
    ...options,
  }

  return generateSpeech(script, speechOptions)
}
