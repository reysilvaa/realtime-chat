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

function parseDuration(durationStr: string): number {
  let duration = 0;
  if (durationStr) {
    const parts = durationStr.split(':');
    if (parts.length === 2) {
      duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      duration = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
  }
  return duration;
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const query = url.searchParams.get('q');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return json({
        songs: [],
        videos: [],
        artists: [],
        albums: [],
        playlists: []
      });
    }

    const api = await getYTMusicInstance();

    // Fetch all types in parallel
    const [songsRaw, videosRaw, artistsRaw, albumsRaw, playlistsRaw] = await Promise.all([
      api.searchSongs(query).catch(() => []),
      api.searchVideos(query).catch(() => []),
      api.searchArtists(query).catch(() => []),
      api.searchAlbums(query).catch(() => []),
      api.searchPlaylists(query).catch(() => [])
    ]);

    // Map songs
    const songs = songsRaw.slice(0, limit).map((track: any) => ({
      id: track.videoId || track.id,
      name: track.name || track.title || 'Unknown',
      artist: track.artist?.name || track.artists?.[0]?.name || 'Unknown Artist',
      album: track.album?.name,
      duration: parseDuration(track.duration),
      audioUrl: track.videoId ? `https://www.youtube.com/watch?v=${track.videoId}` : '',
      imageUrl: track.thumbnails?.[0]?.url || track.thumbnail || 'https://via.placeholder.com/300',
      youtubeUrl: track.videoId ? `https://www.youtube.com/watch?v=${track.videoId}` : undefined
    }));

    // Map videos
    const videos = videosRaw.slice(0, limit).map((video: any) => ({
      id: video.videoId || video.id,
      title: video.name || video.title || 'Unknown',
      artist: video.artist?.name || video.artists?.[0]?.name || 'Unknown Artist',
      duration: parseDuration(video.duration),
      thumbnailUrl: video.thumbnails?.[0]?.url || video.thumbnail || 'https://via.placeholder.com/300',
      youtubeUrl: video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : '',
      views: video.views || undefined
    }));

    // Map artists
    const artists = artistsRaw.slice(0, limit).map((artist: any) => ({
      id: artist.artistId || artist.id,
      name: artist.name || 'Unknown Artist',
      thumbnailUrl: artist.thumbnails?.[0]?.url || artist.thumbnail || 'https://via.placeholder.com/300',
      subscriberCount: artist.subscribers || undefined
    }));

    // Map albums
    const albums = albumsRaw.slice(0, limit).map((album: any) => ({
      id: album.albumId || album.id,
      name: album.name || album.title || 'Unknown Album',
      artist: album.artist?.name || album.artists?.[0]?.name || 'Unknown Artist',
      year: album.year || undefined,
      thumbnailUrl: album.thumbnails?.[0]?.url || album.thumbnail || 'https://via.placeholder.com/300',
      type: album.type || undefined
    }));

    // Map playlists
    const playlists = playlistsRaw.slice(0, limit).map((playlist: any) => ({
      id: playlist.playlistId || playlist.id,
      name: playlist.name || playlist.title || 'Unknown Playlist',
      author: playlist.author || 'Unknown',
      thumbnailUrl: playlist.thumbnails?.[0]?.url || playlist.thumbnail || 'https://via.placeholder.com/300',
      trackCount: playlist.trackCount?.toString() || undefined
    }));

    return json({
      songs,
      videos,
      artists,
      albums,
      playlists
    });
  } catch (error) {
    console.error('Error searching all:', error);
    return json({ error: 'Failed to search all content' }, { status: 500 });
  }
};

