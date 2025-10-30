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
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    console.log('[Popular API] Initializing YTMusic...');
    const api = await getYTMusicInstance();
    
    // Use more specific, reliable queries
    const popularQueries = [
      'Taylor Swift',
      'The Weeknd', 
      'Billie Eilish',
      'Ed Sheeran',
      'Ariana Grande'
    ];
    const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
    
    console.log('[Popular API] Searching for:', randomQuery);
    let results = await api.searchSongs(randomQuery);
    console.log('[Popular API] Found', results?.length || 0, 'results');
    
    if (!results || results.length === 0) {
      console.log('[Popular API] No results, trying fallback query');
      results = await api.searchSongs('music');
    }
    
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

    console.log('[Popular API] Returning', tracks.length, 'tracks');
    return json(tracks);
  } catch (error) {
    console.error('[Popular API] Error fetching popular tracks:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json({ 
      error: 'Failed to fetch popular tracks',
      details: errorMessage 
    }, { status: 500 });
  }
};
