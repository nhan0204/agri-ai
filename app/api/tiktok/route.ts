// /app/api/tiktok-media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { extractDirectUrl } from "@/lib/utils";
import axios from "axios";

const apiKey = process.env.RAPID_API_KEY as string;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
  }

  try {
    const apiUrl = `https://tiktok-video-audio-downloader-api.p.rapidapi.com/json?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl, {
      headers: {
        "x-rapidapi-host": "tiktok-video-audio-downloader-api.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      responseType: "json",
    });

    const videoLink = extractDirectUrl(response.data.download_links.video);
    const audioLink = extractDirectUrl(response.data.download_links.audio);

    if (!videoLink && !audioLink) {
      return NextResponse.json({ error: "No media links found" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      videoUrl: videoLink,
    });
  } catch (error) {
    console.error("TikTok API error:", error);
    return NextResponse.json({ error: "Failed to fetch TikTok media" }, { status: 500 });
  }
}


