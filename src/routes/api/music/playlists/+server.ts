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
    const results = await api.searchPlaylists(query);
    
    const playlists = results.slice(0, limit).map((playlist: any) => ({
      id: playlist.playlistId || playlist.id,
      name: playlist.name || playlist.title || 'Unknown Playlist',
      author: playlist.author || 'Unknown',
      thumbnailUrl: playlist.thumbnails?.[0]?.url || playlist.thumbnail || 'https://via.placeholder.com/300',
      trackCount: playlist.trackCount?.toString() || undefined
    }));

    return json(playlists);
  } catch (error) {
    console.error('Error searching playlists:', error);
    return json({ error: 'Failed to search playlists' }, { status: 500 });
  }
};

