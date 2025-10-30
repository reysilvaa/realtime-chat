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
    const results = await api.searchSongs(query);
    
    const tracks = results.slice(0, limit).map((track: any) => {
      // Extract duration in seconds
      let duration = 0;
      if (track.duration) {
        if (typeof track.duration === 'number') {
          duration = track.duration;
        } else if (typeof track.duration === 'string') {
          const parts = track.duration.split(':');
          if (parts.length === 2) {
            duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
          } else if (parts.length === 3) {
            duration = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
          }
        }
      }

      return {
        id: track.videoId || track.id,
        name: track.name || track.title || 'Unknown',
        artist: track.artist?.name || track.artists?.[0]?.name || 'Unknown Artist',
        album: track.album?.name,
        duration,
        audioUrl: track.videoId ? `https://www.youtube.com/watch?v=${track.videoId}` : '',
        imageUrl: track.thumbnails?.[0]?.url || track.thumbnail || 'https://via.placeholder.com/300',
        youtubeUrl: track.videoId ? `https://www.youtube.com/watch?v=${track.videoId}` : undefined
      };
    });

    return json(tracks);
  } catch (error) {
    console.error('Error searching tracks:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json({ 
      error: 'Failed to search tracks',
      details: errorMessage
    }, { status: 500 });
  }
};
