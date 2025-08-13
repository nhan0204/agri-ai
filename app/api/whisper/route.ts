import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { openai } from "@ai-sdk/openai";
import { generateText, experimental_transcribe as transcribe } from "ai";
import { extractAgriculturalInsights } from "@/lib/extract-insights";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.RAPID_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Api key not found' }, { status: 404 });
    }

    const id = req.nextUrl.searchParams.get('id');
    const lang = req.nextUrl.searchParams.get('lang') || 'en';
    
    if (!id ) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    
    // Validate language code (basic ISO-639-1 check)
    const validLang = /^[a-z]{2}$/.test(lang);
    if (!validLang) {
      return NextResponse.json(
        { error: 'Invalid language code. Must be in ISO-639-1 format (e.g., "en")' },
        { status: 400 }
      );
    }

    const mp3Url = `https://youtube-mp3-audio-video-downloader.p.rapidapi.com/download-mp3/${id}?quality=low`;
    console.log("Downloading audio from", mp3Url);

    // Download MP3 as ArrayBuffer
    const response = await axios.get(mp3Url, {
      headers: {
        'x-rapidapi-host': 'youtube-mp3-audio-video-downloader.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
      responseType: 'arraybuffer',
    });

    console.log("MP3 data", response.data)

    const audioBuffer = Buffer.from(response.data);

    // Pass MP3 directly to Whisper
    const transcription = await transcribe({
      model: openai.transcription("whisper-1"),
      audio: audioBuffer,
      providerOptions: {
        openai: {
          response_format: "verbose_json",
          timestamp_granularities: ["segment"],
          language: lang || 'en'
        },
      },
    });

    const translation = await generateText({
      model: openai.languageModel('gpt-4.1-mini'),
      system: 'You are an  South East Asia linguist.' +
              'You understand Thai, Lao, Cambodian, Vietnamese, Malaysian' +
              'You must return the translation only and no excessive words',
      prompt: `Translate this transcript into English ${transcription.text}`
    })

    const fullText = transcription.text || "";
    const segments =
      transcription.segments?.map((seg: any) => ({
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
    console.error('Transcription failed:', err);
    return NextResponse.json(
      { error: 'Failed to transcribe audio', details: err.message },
      { status: 500 }
    );
  }
}
