import axios from 'axios';
import * as cheerio from 'cheerio';

interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: number;
  author?: string;
  platform?: string;
}

interface VideoInfo {
  service: string;
  id: string;
}

// Simple video ID extraction
function getVideoInfo(url: string): VideoInfo | null {
  // TikTok URL patterns
  const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?(?:vm\.)?tiktok\.com\/(?:@[\w.-]+\/video\/|v\/)?(\d+)/;
  const tiktokMatch = url.match(tiktokRegex);
  if (tiktokMatch) {
    return { service: 'tiktok', id: tiktokMatch[1] };
  }

  // YouTube URL patterns
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return { service: 'youtube', id: youtubeMatch[1] };
  }

  return null;
}

// TikTok oEmbed API
async function getTikTokMetadata(videoId: string): Promise<VideoMetadata | null> {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/video/${videoId}`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch TikTok metadata');
    }

    const data = await response.json();

    return {
      title: data.title || 'TikTok Video',
      thumbnail: data.thumbnail_url || '',
      duration: 60, // TikTok oEmbed doesn't provide duration, default to 60s
      author: data.author_name || '',
      platform: 'TikTok',
    };
  } catch (error) {
    console.error('Error fetching TikTok metadata:', error);
    return null;
  }
}

// YouTube metadata via scraping (no API key)
async function getYouTubeMetadata(videoId: string): Promise<VideoMetadata | null> {
  try {
    const response = await fetch(`/api/get-youtube-metadata?videoId=${videoId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch YouTube metadata from API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}

// Extract metadata from HTML5 video element
async function getVideoElementMetadata(url: string): Promise<VideoMetadata | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        video.currentTime = video.duration * 0.1;

        video.onseeked = () => {
          ctx.drawImage(video, 0, 0);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);

          resolve({
            title: 'Video File',
            thumbnail,
            duration: Math.floor(video.duration),
            platform: 'Direct URL',
          });
        };
      } else {
        resolve({
          title: 'Video File',
          thumbnail: '',
          duration: Math.floor(video.duration),
          platform: 'Direct URL',
        });
      }
    };

    video.onerror = () => {
      resolve(null);
    };

    video.src = url;
  });
}

// Main function to extract video metadata
export async function extractVideoMetadata(url: string): Promise<VideoMetadata | null> {
  const videoInfo = getVideoInfo(url);
  console.log(url);
  console.log(videoInfo?.service);

  if (videoInfo) {
    switch (videoInfo.service) {
      case 'tiktok':
        return await getTikTokMetadata(videoInfo.id);
      case 'youtube':
        return await getYouTubeMetadata(videoInfo.id);
    }
  }

  // For direct video URLs or unknown platforms
  if (url.match(/\.(mp4|mov|avi|webm)$/i) || url.startsWith('http')) {
    return await getVideoElementMetadata(url);
  }

  return null;
}

// Helper function to format duration from ISO 8601 (for YouTube scraping)
export function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = Number.parseInt(match[1] || '0', 10);
  const minutes = Number.parseInt(match[2] || '0', 10);
  const seconds = Number.parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}