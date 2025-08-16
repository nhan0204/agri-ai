
export type VideoFile = {
  id: string
  name: string
  videoUrl: string
  audioUrl?: string
  thumbnail?: string
  duration: number
  transcription?: string
  keyInsights?: string[]
  platform?: string,
  language: Language,
  transcription?: string,
}

export type GeneratedScript = {
  title: string
  script: string
  keyPoints: string[]
  targetAudience: string
  language: Language
}

export type Language = 'en' | 'vi' | 'ms' | 'fil';

export type Region = 'philippines' | 'vietnam' | 'malaysia';