import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import YTMusic from 'ytmusic-api';

let ytmusic: YTMusic | null = null;

async function getYTMusicInstance(): Promise<YTMusic> {
  if (ytmusic) {
    return ytmusic;
  }

  ytmusic = new YTMusic();
  await ytmusic.initialize();
  return ytmusic;
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const query = url.searchParams.get('q');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return json([]);
    }

    const api = await getYTMusicInstance();
    const results = await api.searchVideos(query);
    
    const videos = results.slice(0, limit).map((video: any) => {
      // Extract duration in seconds
      let duration = 0;
      if (video.duration) {
        const parts = video.duration.split(':');
        if (parts.length === 2) {
          duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 3) {
          duration = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        }
      }

      return {
        id: video.videoId || video.id,
        title: video.name || video.title || 'Unknown',
        artist: video.artist?.name || video.artists?.[0]?.name || 'Unknown Artist',
        duration,
        thumbnailUrl: video.thumbnails?.[0]?.url || video.thumbnail || 'https://via.placeholder.com/300',
        youtubeUrl: video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : '',
        views: video.views || undefined
      };
    });

    return json(videos);
  } catch (error) {
    console.error('Error searching videos:', error);
    return json({ error: 'Failed to search videos' }, { status: 500 });
  }
};

