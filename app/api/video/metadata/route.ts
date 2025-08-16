import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: number;
  platform?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const videoId = searchParams.get('videoId');
  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
  }

  try {
    const url = `https://youtube-video-information1.p.rapidapi.com/api/youtube?video_id=${videoId}`;
    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-host': 'youtube-video-information1.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_API_KEY,
      },
    });

    const data = response.data;

    const metadata: VideoMetadata = {
      title: data.title || 'YouTube Video',
      thumbnail: data.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: parseISO8601Duration(data.duration || 'PT0S'),
      platform: 'YouTube',
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch video metadata' }, { status: 500 });
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