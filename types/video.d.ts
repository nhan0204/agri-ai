
export type VideoFile = {
  id: string
  name: string
  url: string
  thumbnail?: string
  duration: number
  transcription?: string
  keyInsights?: string[]
  platform?: string,
  language: Language,
}

export type GeneratedScript = {
  title: string
  script: string
  keyPoints: string[]
  targetAudience: string
  language: string
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja' | 'ko' | 'zh' | 'hi' | 'ar' | 'th' | 'vi' | 'id' | 'ms' | 'tl';