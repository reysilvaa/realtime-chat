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
    const results = await api.searchArtists(query);
    
    const artists = results.slice(0, limit).map((artist: any) => ({
      id: artist.artistId || artist.id,
      name: artist.name || 'Unknown Artist',
      thumbnailUrl: artist.thumbnails?.[0]?.url || artist.thumbnail || 'https://via.placeholder.com/300',
      subscriberCount: artist.subscribers || undefined
    }));

    return json(artists);
  } catch (error) {
    console.error('Error searching artists:', error);
    return json({ error: 'Failed to search artists' }, { status: 500 });
  }
};

