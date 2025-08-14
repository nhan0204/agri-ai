import type { VideoFile } from "@/types/video"
import type { SpeechResult } from "@/lib/speech-generator"

export async function generateMixedVideo(
  videos: VideoFile[],
  speechResult: SpeechResult | null
): Promise<{ renderId: string; statusUrl: string }> {
  const videoUrls = videos.map((v) => v.url).filter(Boolean)
  if (videoUrls.length === 0) {
    throw new Error("No valid video URLs provided")
  }

  let currentStart = 0
  const clips = videoUrls.map((url, index) => {
    const clipLength = 5
    const clip = {
      asset: { type: "video", src: url, trim: 0 },
      start: currentStart,
      length: clipLength,
      transition: index > 0 ? { in: "fade", duration: 1 } : undefined,
    }
    currentStart += clipLength
    return clip
  })

  const timeline: any = { tracks: [{ clips }] }

  if (speechResult?.audioUrl) {
    timeline.soundtrack = {
      src: speechResult.audioUrl,
      effect: "fadeInFadeOut",
      volume: 1,
    }
  }

  const payload = {
    timeline,
    output: {
      format: "mp4",
      resolution: "hd",
      aspectRatio: "16:9",
      fps: 25,
      quality: "high",
    },
  }

  // POST to API route with payload
  const res = await fetch("/api/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`)
  }

  const data = await res.json();

  console.log(data)

  return data;
}
