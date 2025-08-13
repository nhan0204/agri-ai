import { Language } from '@/types/video';
import { getVideoInfo } from './video-metadata';

const transcriptionPromises = new Map<string, Promise<TranscriptionResult>>();

export interface TranscriptionResult {
  text: string
  segments: Array<{
    start: number
    end: number
    text: string
  }>
  language: string
  duration: number
  keyInsights?: string[]
}

export interface TranscriptionOptions {
  language?: string
  mode?: "native" | "auto" | "generate"
  text?: boolean
}

/**
 * Transcribe video from URL using Supadata API for all platforms
 * @param videoUrl - URL to the video (YouTube, TikTok, Instagram, X, etc.)
 * @param options - Transcription options
 * @returns Transcription result with text and segments
 */
export async function transcribeVideoFromUrl(
  videoUrl: string,
  language: Language,
): Promise<TranscriptionResult> {
  // Check cache first
  if (transcriptionPromises.has(videoUrl)) {
    console.log(`Reusing cached promise for: ${videoUrl}`);
    return transcriptionPromises.get(videoUrl)!;
  }

  const promise = (async () => {
    try {
      console.log(`Starting transcription for video: ${videoUrl}`);

      // Check if this is an external URL
      const isExternalUrl = videoUrl.startsWith("http") && !videoUrl.includes(window.location.hostname);

      if (!isExternalUrl) {
        // For local files, use mock transcription
        console.log("Local file detected, using mock transcription");
        return generateMockTranscription(videoUrl);
      }

      console.log("External url detected");

      const videoInfo = getVideoInfo(videoUrl)!

      if (!videoInfo) {
        throw new Error(`Invalid video`);
      }

      const { service, id } = videoInfo;
      
      console.log(`Platform ${service} - ${id}`)
      
      switch (service) {
        case 'youtube':
          const youtubResponse = await fetch(`api/whisper?id=${id}&lang=${language}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })

          if (!youtubResponse.ok) return null;

          const youtubeTranscript = await youtubResponse.json();

          console.log("Whisper transcription successful: ", youtubeTranscript);
          return youtubeTranscript;
      
        case 'tiktok':
          videoUrl = videoUrl.split('?')[0]

          const tiktokResponse = await fetch('api/tiktok', {
            method: "POST",
            body: JSON.stringify({videoUrl})
          })

          if (!tiktokResponse.ok) return null;

          const tiktokTranscript = await tiktokResponse.json();

          console.log("Tiktok transcription successful: ", tiktokTranscript);
          return tiktokTranscript;
      }
    } catch (error) {
      console.error("Video transcription failed:", error);
      return generateMockTranscription(videoUrl);
    }
  })();

  transcriptionPromises.set(videoUrl, promise);

  // Optional: Clean up cache after resolution (to avoid memory leaks in long-running apps)
  promise.finally(() => {
    transcriptionPromises.delete(videoUrl);
  });

  return promise;
}

function generateMockTranscription(videoUrl: string): TranscriptionResult {
  const mockTranscriptions = [
    {
      text: "Hello fellow farmers! Today I want to share with you how to identify and treat brown spot disease in rice. This is very common during rainy season. Look for these brown oval spots on the leaves - they start small but can spread quickly if not treated. The best time to spray is early morning or evening when it's not too hot.",
      segments: [
        { start: 0, end: 5, text: "Hello fellow farmers! Today I want to share with you" },
        { start: 5, end: 12, text: "how to identify and treat brown spot disease in rice." },
        { start: 12, end: 18, text: "This is very common during rainy season." },
        { start: 18, end: 25, text: "Look for these brown oval spots on the leaves" },
        { start: 25, end: 30, text: "The best time to spray is early morning or evening" },
      ],
      keyInsights: [
        "Plant disease identification and treatment",
        "Application techniques and timing",
        "Pest management techniques discussed",
      ],
    },
    {
      text: "Good morning everyone! Let me show you how to make organic pesticide using neem oil. This is very effective and safe for our crops. You need 2 tablespoons of neem oil, 1 liter of water, and a few drops of dish soap to help it mix. Spray this in the evening when the sun is not strong.",
      segments: [
        { start: 0, end: 6, text: "Good morning everyone! Let me show you" },
        { start: 6, end: 12, text: "how to make organic pesticide using neem oil." },
        { start: 12, end: 18, text: "This is very effective and safe for our crops." },
        { start: 18, end: 25, text: "You need 2 tablespoons of neem oil, 1 liter of water" },
        { start: 25, end: 30, text: "Spray this in the evening when the sun is not strong." },
      ],
      keyInsights: [
        "Organic farming methods",
        "Pest management techniques discussed",
        "Application techniques and timing",
      ],
    },
    {
      text: "Hi farmers! Today's topic is about proper fertilizer application for better yield. Many of us make mistakes with timing and quantity. For rice, apply nitrogen fertilizer in three stages - at planting, tillering, and panicle initiation. This will give you much better results than applying all at once.",
      segments: [
        { start: 0, end: 5, text: "Hi farmers! Today's topic is about proper fertilizer application" },
        { start: 5, end: 12, text: "for better yield. Many of us make mistakes with timing and quantity." },
        { start: 12, end: 20, text: "For rice, apply nitrogen fertilizer in three stages." },
        { start: 20, end: 30, text: "This will give you much better results than applying all at once." },
      ],
      keyInsights: [
        "Fertilization and nutrition guidance",
        "Harvesting and yield optimization tips",
        "Application techniques and timing",
      ],
    },
  ]

  const randomIndex = Math.floor(Math.random() * mockTranscriptions.length)
  const mockResult = mockTranscriptions[randomIndex]

  return {
    ...mockResult,
    language: "en",
    duration: 30,
  }
}