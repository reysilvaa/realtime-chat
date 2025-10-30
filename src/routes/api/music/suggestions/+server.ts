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

    if (!query || query.length < 2) {
      return json([]);
    }

    const api = await getYTMusicInstance();
    const suggestions = await api.getSearchSuggestions(query);

    return json(suggestions);
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
};

