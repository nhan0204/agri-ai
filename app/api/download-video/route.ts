import { NextRequest, NextResponse } from "next/server";
import { extractDirectUrl } from "@/lib/utils";
import axios from "axios";
import { getVideoInfo } from "@/lib/video-metadata";

const apiKey = process.env.RAPID_API_KEY as string;

export async function GET(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "Missing apiKey" }, { status: 400 });
  }

  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
  }

  const videoInfo = getVideoInfo(url);
  
  if (!videoInfo) {
    return NextResponse.json({ error: "Invalid video info" }, { status: 400 });
  }

  const { id, service } = videoInfo;

  let videoUrl

  try {
    switch (service) {
      case "tiktok":
        videoUrl = await donwloadTiktok(url);
        break;
      case "youtube":
        videoUrl = await donwloadYouTube(id);
        break;
      default:
        break;
    }

    return NextResponse.json({ videoUrl: videoUrl }, { status: 200 });
  } catch (error) {
    console.error("TikTok API error:", error);
    return NextResponse.json({ error: "Failed to fetch TikTok media" }, { status: 500 });
  }
}

async function donwloadTiktok(url: string) {
  try {
    const apiUrl = `https://tiktok-video-audio-downloader-api.p.rapidapi.com/json?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl, {
      headers: {
        "x-rapidapi-host": "tiktok-video-audio-downloader-api.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      responseType: "json",
    });

    return extractDirectUrl(response.data.download_links.video);
  } catch (error) {
    console.error("Error downloading TikTok media:", error);
    throw new Error("Failed to download TikTok media"); 
  }
}

async function donwloadYouTube(id: string) {
  try {
    const apiUrl = `https://youtube-video-fast-downloader-24-7.p.rapidapi.com/download_video/${id}?quality=247`;
    const response = await axios.get(apiUrl, {
      headers: {
        "x-rapidapi-host": "youtube-video-fast-downloader-24-7.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      responseType: "json",
    });

    if (!response.data || !response.data.file) {
      throw new Error("No video file found in response");
    }

    const videoLink = response.data.file;

    return videoLink;
  } catch (error) {
    console.error("Error downloading TikTok media:", error);
    throw new Error("Failed to download TikTok media"); 
  }
}