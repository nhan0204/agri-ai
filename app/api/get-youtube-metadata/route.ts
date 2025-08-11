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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36', // Updated to modern Chrome
        'Accept-Language': 'en-US,en;q=0.9', // Mimics English browser
        'Cookie': 'CONSENT=YES+1', // Bypasses consent page
      },
    });
    const $ = cheerio.load(response.data);

    let title = $('meta[name="title"]').attr('content') || 'YouTube Video';
    let thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    let author = $('.ytd-channel-name a').text().trim() || 'Unknown Author';
    let durationRaw = $('meta[itemprop="duration"]').attr('content') || 'PT0S';
    let duration = parseISO8601Duration(durationRaw);

    // If defaults, try JSON parse
    if (duration === 0 || author === 'Unknown Author' || title === 'YouTube Video') {
      const scripts = $('script');
      let playerResponse: any = null;
      scripts.each((i, elem) => {
        const text = $(elem).html();
        if (text && text.includes('ytInitialPlayerResponse')) {
          const match = text.match(/var ytInitialPlayerResponse = ({[\s\S]*?});/);
          if (match && match[1]) {
            playerResponse = JSON.parse(match[1]);
          }
        }
      });

      if (playerResponse && playerResponse.videoDetails) {
        title = playerResponse.videoDetails.title || title;
        author = playerResponse.videoDetails.author || author;
        duration = parseInt(playerResponse.videoDetails.lengthSeconds, 10) || duration;
      }
    }

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