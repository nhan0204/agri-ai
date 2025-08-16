import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { openai } from "@ai-sdk/openai";
import { generateText, experimental_transcribe as transcribe } from "ai";
import { getVideoInfo } from "@/lib/video-metadata";
import { extractDirectUrl } from "@/lib/utils";

const apiKey = process.env.RAPID_API_KEY;

export async function GET(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "Api key not found" }, { status: 404 });
    }

    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "Video url is required" },
        { status: 400 }
      );
    }

    const lang = req.nextUrl.searchParams.get("lang") || "en";
    const validLang = /^[a-z]{2}$/.test(lang);

    if (!validLang) {
      return NextResponse.json(
        { error: 'Invalid language code. Must be in ISO-639-1 format (e.g., "en")', },
        { status: 400 }
      );
    }

    let audio;

    const info = getVideoInfo(url);

    if (!info) {
      throw new Error(`Failed to get ${url} info`);
    }

    const { service, id } = info;

    console.log(`Serving platform ${service}`);

    switch (service) {
      case "youtube":
        audio = await getYoutubeAudio(id);
        break;

      case "tiktok":
        audio = await getTiktokAudio(url);
        break;

      default:
        throw new Error("Unsupport video platform");
    }

    const transcription = await transcribe({
      model: openai.transcription("whisper-1"),
      audio: audio!,
      providerOptions: {
        openai: {
          response_format: "verbose_json",
          timestamp_granularities: ["segment"],
          language: lang || "en",
        },
      },
    });

    const translation = await generateText({
      model: openai.languageModel("gpt-4.1-mini"),
      system:
        "You are an  South East Asia linguist." +
        "You understand Thai, Lao, Cambodian, Vietnamese, Malaysian" +
        "You must return the translation only and no excessive words" +
        "If it's not meaningful speech, return exactly 'No speech detected' and nothing else." +
        "If it is meaningful speech, return the translation only and no excessive words.",
      prompt: `Translate this transcript into English ${transcription.text}`,
    });

    const fullText = transcription.text || "";
    const segments = transcription.segments?.map((seg: any) => ({
      start: seg.startSecond || 0,
      end: seg.endSecond || 0,
      text: seg.text || "",
    })) || [{ start: 0, end: 30, text: fullText }];

    const duration =
      transcription.durationInSeconds ||
      (segments.length > 0 ? Math.max(...segments.map((s: any) => s.end)) : 30);

    return NextResponse.json({
      text: translation.text,
      segments,
      language: lang,
      duration,
    });
  } catch (err: any) {
    console.error("Transcription failed:", err);
    return NextResponse.json(
      { error: "Failed to transcribe audio", details: err.message },
      { status: 500 }
    );
  }
}

async function getYoutubeAudio(id: string) {
  try {
    const url = `https://youtube-mp3-audio-video-downloader.p.rapidapi.com/download-mp3/${id}?quality=low`;
    console.log("Downloading audio from", url);

    // Download MP3 as ArrayBuffer
    const response = await axios.get(url, {
      headers: {
        "x-rapidapi-host": "youtube-mp3-audio-video-downloader.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      responseType: "arraybuffer",
    });

    console.log("Audio data", response.data);

    const audioBuffer = Buffer.from(response.data);

    if (!audioBuffer) {
      throw new Error(`Failed to download audio from youtube: ${id}`);
    }

    return audioBuffer;
  } catch (error) {
    console.error("Get youtube api error", error);
    throw error;
  }
}

async function getTiktokAudio(url: string) {
  try {
    const apiUrl = `https://tiktok-video-audio-downloader-api.p.rapidapi.com/json?url=${url}`;
    console.log("Downloading audio from", apiUrl);
    const response = await axios.get(apiUrl, {
      headers: {
        "x-rapidapi-host": "tiktok-video-audio-downloader-api.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      responseType: "json",
    });

    const downloadUrl = response.data.download_links.audio;
    
    if (!downloadUrl) {
      throw new Error(`Failed to get audio link from tiktok: ${url}`);
    }

    console.log("Audio download URL:", downloadUrl);
    
    const directAudioUrl = extractDirectUrl(downloadUrl);

    if (!directAudioUrl) {
      throw new Error("Failed to get direct url");
    }

    const audioResponse = await axios.get(directAudioUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    console.log("Audio data", audioResponse.data);

    const audioBuffer = Buffer.from(audioResponse.data);
    
    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error(`Failed to get audio from: ${directAudioUrl}`);
    }

    return audioBuffer;
  } catch (error) {
    console.error("Get tiktok api error", error);
    throw error;
  }
}
