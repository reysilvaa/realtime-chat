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
    const results = await api.searchAlbums(query);
    
    const albums = results.slice(0, limit).map((album: any) => ({
      id: album.albumId || album.id,
      name: album.name || album.title || 'Unknown Album',
      artist: album.artist?.name || album.artists?.[0]?.name || 'Unknown Artist',
      year: album.year || undefined,
      thumbnailUrl: album.thumbnails?.[0]?.url || album.thumbnail || 'https://via.placeholder.com/300',
      type: album.type || undefined
    }));

    return json(albums);
  } catch (error) {
    console.error('Error searching albums:', error);
    return json({ error: 'Failed to search albums' }, { status: 500 });
  }
};

