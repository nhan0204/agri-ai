import { Language } from "./video"

export interface VoiceOption {
  id: string
  name: string
  language: Language
  accent: string
  gender: "male" | "female"
  elevenLabsId: string
  culturalFit?: string
}

export interface SpeechOptions {
  voiceId?: string
  modelId?: string
  outputFormat?: string
  language?: Language
  speed?: number
}

export interface SpeechResult {
  audioUrl: string
  duration: number
  voiceUsed: string
  success: boolean
  error?: string
}
