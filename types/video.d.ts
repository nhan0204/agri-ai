
export type VideoFile = {
  id: string
  name: string
  url: string
  duration: number
  transcription?: string
  keyInsights?: string[]
  platform?: string
  author?: string
}

export type GeneratedScript = {
  title: string
  script: string
  keyPoints: string[]
  targetAudience: string
  language: string
}