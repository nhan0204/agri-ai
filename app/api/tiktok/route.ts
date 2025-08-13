import { NextRequest, NextResponse } from "next/server";
import { extractAgriculturalInsights } from "@/lib/extract-insights";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RAPID_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    const { videoUrl } = await req.json();

    if (!videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const transcript = await axios.post(
      'https://tiktok-transcript.p.rapidapi.com/transcribe-tiktok-audio',
      new URLSearchParams({ url: videoUrl }), // Send URL as form data
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-rapidapi-host': 'tiktok-transcript.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
      }
    );

    if (!transcript?.data?.response) {
      return NextResponse.json(
        { error: 'TikTok transcript failed' },
        { status: 500 }
      );
    }

    const { response } = transcript.data;

    return NextResponse.json({
      text: response.text,
      segments: response.segments,
      language: response.language,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}