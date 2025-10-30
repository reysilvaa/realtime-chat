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
    const videoId = url.searchParams.get('videoId');

    if (!videoId) {
      return json({ error: 'videoId is required' }, { status: 400 });
    }

    const api = await getYTMusicInstance();
    
    // Get song details which may include lyrics
    const song = await api.getSong(videoId);
    
    if (song && song.lyrics) {
      return json({
        lyrics: song.lyrics,
        source: 'YouTube Music'
      });
    }

    return json({ error: 'Lyrics not available' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return json({ error: 'Failed to fetch lyrics' }, { status: 500 });
  }
};

