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

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { videoId } = params;

    if (!videoId) {
      return json({ error: 'videoId is required' }, { status: 400 });
    }

    const api = await getYTMusicInstance();
    const song = await api.getSong(videoId);

    if (!song) {
      return json({ error: 'Song not found' }, { status: 404 });
    }

    // Extract duration in seconds
    let duration = 0;
    if (song.duration) {
      const parts = song.duration.toString().split(':');
      if (parts.length === 2) {
        duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      } else if (parts.length === 3) {
        duration = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
      }
    }

    const track = {
      id: song.videoId || videoId,
      name: song.name || 'Unknown',
      artist: song.artist?.name || 'Unknown Artist',
      album: song.name,
      duration,
      audioUrl: `https://www.youtube.com/watch?v=${videoId}`,
      imageUrl: song.thumbnails?.[0]?.url || 'https://via.placeholder.com/300',
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`
    };

    return json(track);
  } catch (error) {
    console.error('Error fetching song details:', error);
    return json({ error: 'Failed to fetch song details' }, { status: 500 });
  }
};

