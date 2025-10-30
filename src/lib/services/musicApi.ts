import { MUSIC_API } from '$lib/config';

export interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  duration: number;
  audioUrl: string;
  imageUrl: string;
  youtubeUrl?: string;
}

export interface Video {
  id: string;
  title: string;
  artist: string;
  duration: number;
  thumbnailUrl: string;
  youtubeUrl: string;
  views?: string;
}

export interface Artist {
  id: string;
  name: string;
  thumbnailUrl: string;
  subscriberCount?: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  year?: string;
  thumbnailUrl: string;
  type?: string;
}

export interface Playlist {
  id: string;
  name: string;
  author: string;
  thumbnailUrl: string;
  trackCount?: string;
}

export interface Lyrics {
  lyrics: string;
  source: string;
}

export interface SearchSuggestion {
  text: string;
}

export interface SearchResults {
  songs: Track[];
  videos: Video[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export interface RadioStation {
  id: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  language: string;
  tags: string[];
  votes: number;
}

export async function fetchPopularTracks(limit: number = 20): Promise<Track[]> {
  try {
    const response = await fetch(`/api/music/popular?limit=${limit}`);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('[fetchPopularTracks] Response not OK:', response.status, text.substring(0, 200));
      throw new Error(`Failed to fetch popular tracks: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[fetchPopularTracks] Not JSON response:', contentType, text.substring(0, 200));
      throw new Error('Invalid response format');
    }

    const tracks = await response.json();
    console.log('[fetchPopularTracks] Successfully loaded', tracks.length, 'tracks');
    return tracks;
  } catch (error) {
    console.error('Error fetching popular tracks:', error);
    return [];
  }
}

export async function searchTracks(query: string, limit: number = 20): Promise<Track[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`/api/music/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to search tracks');
    }

    const tracks = await response.json();
    return tracks;
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
}

export async function fetchRadioStations(limit: number = 50): Promise<RadioStation[]> {
  try {
    const response = await fetch(
      `${MUSIC_API.radioBrowserUrl}/stations/search?limit=${limit}&order=votes&reverse=true&hidebroken=true`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch radio stations: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.map((station: any) => ({
      id: station.stationuuid,
      name: station.name,
      url: station.url_resolved || station.url,
      favicon: station.favicon || 'https://via.placeholder.com/100',
      country: station.country,
      language: station.language,
      tags: station.tags ? station.tags.split(',').map((t: string) => t.trim()) : [],
      votes: station.votes
    }));
  } catch (error) {
    console.error('Error fetching radio stations:', error);
    return [];
  }
}

// Get search suggestions
export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`/api/music/suggestions?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    const suggestions = await response.json();
    return suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

// Search all content types
export async function searchAll(query: string, limit: number = 10): Promise<SearchResults> {
  if (!query || query.length < 2) {
    return {
      songs: [],
      videos: [],
      artists: [],
      albums: [],
      playlists: []
    };
  }

  try {
    const response = await fetch(`/api/music/search-all?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to search all');
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Error searching all:', error);
    return {
      songs: [],
      videos: [],
      artists: [],
      albums: [],
      playlists: []
    };
  }
}

// Search videos
export async function searchVideos(query: string, limit: number = 20): Promise<Video[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`/api/music/videos?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to search videos');
    }

    const videos = await response.json();
    return videos;
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

// Search artists
export async function searchArtists(query: string, limit: number = 20): Promise<Artist[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`/api/music/artists?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to search artists');
    }

    const artists = await response.json();
    return artists;
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
}

// Search albums
export async function searchAlbums(query: string, limit: number = 20): Promise<Album[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`/api/music/albums?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to search albums');
    }

    const albums = await response.json();
    return albums;
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
}

// Search playlists
export async function searchPlaylists(query: string, limit: number = 20): Promise<Playlist[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`/api/music/playlists?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to search playlists');
    }

    const playlists = await response.json();
    return playlists;
  } catch (error) {
    console.error('Error searching playlists:', error);
    return [];
  }
}

// Get lyrics for a song
export async function getLyrics(videoId: string): Promise<Lyrics | null> {
  try {
    const response = await fetch(`/api/music/lyrics?videoId=${videoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch lyrics');
    }

    const lyrics = await response.json();
    return lyrics;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
}

// Get song details
export async function getSongDetails(videoId: string): Promise<Track | null> {
  try {
    const response = await fetch(`/api/music/song/${videoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch song details');
    }

    const song = await response.json();
    return song;
  } catch (error) {
    console.error('Error fetching song details:', error);
    return null;
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
