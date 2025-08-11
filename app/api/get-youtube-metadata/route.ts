import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: number;
  author?: string;
  platform?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const videoId = searchParams.get('videoId');
  if (!videoId || typeof videoId !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid videoId' }, { status: 400 });
  }

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);

    const title = $('meta[name="title"]').attr('content') || 'YouTube Video';
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const author = $('.ytd-channel-name a').text().trim() || 'Unknown Author';
    const durationRaw = $('meta[itemprop="duration"]').attr('content') || 'PT0S';
    const duration = parseISO8601Duration(durationRaw);

    const metadata: VideoMetadata = {
      title,
      thumbnail,
      duration,
      author,
      platform: 'YouTube',
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}

function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = Number.parseInt(match[1] || '0', 10);
  const minutes = Number.parseInt(match[2] || '0', 10);
  const seconds = Number.parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}