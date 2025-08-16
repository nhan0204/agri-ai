import { SpeechResult } from "@/types/speech";
import { VideoFile } from "@/types/video";

export async function generateMixedVideo(
  videos: VideoFile[],
  speechResult: SpeechResult | null,
  volume: number = 0.1,
  clipLength: number = 10
): Promise<{ renderId: string; status: string; videoUrl: string }> {
  console.log("Starting generateMixedVideo with videos:", videos, "and speechResult:", speechResult);

  const videoUrls: string[] = [];

  // Process video URLs
  for (const v of videos) {
    if (!v.videoUrl) {
      console.log("Skipping video without URL:", v);
      continue;
    }
    console.log("Processing video url:", v.videoUrl);
    
    const res = await fetch(`/api/video/download?url=${encodeURIComponent(v.videoUrl)}`, { method: "GET" });
    
    if (!res.ok) throw new Error(`Failed to fetch direct TikTok URL: ${v.videoUrl}`);

    const { videoUrl } = await res.json();
    console.log("Received videoUrl:", videoUrl);
    
    if (videoUrl) 
      videoUrls.push(videoUrl);
  }

  console.log("Collected videoUrls:", videoUrls);

  if (videoUrls.length === 0) {
    console.error("No valid video URLs provided");
    throw new Error("No valid video URLs provided");
  }

  // Build video clips
  let currentStart = 0;
  const clips = videoUrls.map((url, index) => {
    const clip = {
      asset: { type: "video", src: url, trim: 0, volume: volume },
      start: currentStart,
      length: clipLength,
      transition: index > 0 ? { in: "fade" } : undefined,  // Removed invalid 'duration'; use 'fade' for 1-second default
    };
    currentStart += clipLength;
    return clip;
  })

  console.log("Built clips:", clips);

  const timeline: any = { tracks: [{ clips }] };
  console.log("Initial timeline:", timeline);

  // Handle audio upload via new API route
  if (speechResult?.audioUrl) {
    console.log("Handling audio URL:", speechResult.audioUrl);
    let audioUrl = speechResult.audioUrl;
    if (speechResult.audioUrl.startsWith("blob:")) {
      console.log("Uploading blob to /api/audio/upload");
      const formData = new FormData();
      const response = await fetch(speechResult.audioUrl);
      const audioBlob = await response.blob();
      formData.append("audio", audioBlob, "speech_audio.mp3");

      const uploadRes = await fetch("/api/audio/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload audio response status:", uploadRes.status);
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error("Upload audio error:", errorText);
        throw new Error(`Failed to upload audio: ${errorText}`);
      }

      const { url } = await uploadRes.json();
      console.log("Received audio URL from upload:", url);
      audioUrl = url;
    } else {
      console.log("Using direct public audio URL:", speechResult.audioUrl);
    }

    // Add audio URL to timeline
    timeline.soundtrack = {
      src: audioUrl,
      effect: "fadeInFadeOut",
      volume: 1,
    };
    console.log("Updated timeline with soundtrack:", timeline);
  } else {
    console.log("No audio URL provided, proceeding without soundtrack");
  }

  const payload = {
    timeline,
    output: {
      format: "mp4",
      fps: 25,
      quality: "high",
      size: {
        width: 720,
        height: 1280,
      }
    },
  };

  console.log("Rendering timeline: ", timeline);

  console.log("Sending POST to /api/video/generate");
  const res = await fetch("/api/video/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });

  console.log("API response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API error text:", errorText);
    throw new Error(`API error: ${res.status} - ${errorText}`);
  }

  const jsonResponse = await res.json();
  console.log("API success response:", jsonResponse);

  return jsonResponse; // { renderId, status, videoUrl }
}

export async function checkRenderStatus(renderId: string) {
  console.log("Checking render status for renderId:", renderId);
  const res = await fetch(`/api/video/generate/stage?renderId=${renderId}`);
  console.log("Status check response status:", res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Status check error text:", errorText);
    throw new Error(`Failed to check render status: ${res.status} - ${errorText}`);
  }
  const data = await res.json();
  console.log("Status check data:", data);
  return data;
}

export function downloadVideo(videoUrl: string, filename = "generated-video.mp4"): void  {
  const link = document.createElement("a")
  link.href = videoUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}