import { writable } from 'svelte/store';
import type { Track, RadioStation } from '$lib/services/musicApi';
import { fetchPopularTracks, fetchRadioStations } from '$lib/services/musicApi';

interface MusicState {
  tracks: Track[];
  radioStations: RadioStation[];
  currentTrack: Track | RadioStation | null;
  isPlaying: boolean;
  loading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  playerType: 'youtube' | 'audio' | null;
}

function createMusicStore() {
  const { subscribe, set, update } = writable<MusicState>({
    tracks: [],
    radioStations: [],
    currentTrack: null,
    isPlaying: false,
    loading: false,
    error: null,
    currentTime: 0,
    duration: 0,
    playerType: null
  });

  let audioElement: HTMLAudioElement | null = null;

  function initAudio() {
    if (typeof window === 'undefined') return;
    
    if (!audioElement) {
      audioElement = new Audio();
      
      audioElement.addEventListener('timeupdate', () => {
        if (audioElement) {
          update(state => ({
            ...state,
            currentTime: audioElement!.currentTime,
            duration: audioElement!.duration || 0
          }));
        }
      });

      audioElement.addEventListener('ended', () => {
        update(state => ({ ...state, isPlaying: false }));
      });

      audioElement.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        update(state => ({ 
          ...state, 
          isPlaying: false,
          error: 'Failed to load audio'
        }));
      });
    }
  }

  return {
    subscribe,
    
    async loadPopularTracks() {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const tracks = await fetchPopularTracks();
        update(state => ({
          ...state,
          tracks,
          loading: false
        }));
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load tracks'
        }));
      }
    },

    async loadRadioStations() {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const radioStations = await fetchRadioStations();
        update(state => ({
          ...state,
          radioStations,
          loading: false
        }));
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load radio stations'
        }));
      }
    },

    setCurrentTrack(track: Track | RadioStation, playerType: 'youtube' | 'audio') {
      update(state => ({
        ...state,
        currentTrack: track,
        playerType,
        currentTime: 0,
        duration: 0,
        isPlaying: false
      }));
    },

    setPlayingState(isPlaying: boolean) {
      update(state => ({ ...state, isPlaying }));
    },

    setTimeAndDuration(currentTime: number, duration: number) {
      update(state => ({ ...state, currentTime, duration }));
    },

    async playRadio(station: RadioStation) {
      initAudio();
      
      if (!audioElement) return;
      
      // Check if same station
      let isSameStation = false;
      const unsubscribe = subscribe(state => {
        isSameStation = state.currentTrack?.id === station.id;
      });
      unsubscribe();

      // If same station and playing, pause and return
      if (isSameStation && !audioElement.paused) {
        audioElement.pause();
        update(state => ({ ...state, isPlaying: false }));
        return;
      }

      // If different station, stop current and load new one
      if (!isSameStation) {
        // Pause current track first
        if (!audioElement.paused) {
          audioElement.pause();
        }
        
        audioElement.src = station.url;
        audioElement.load();
        
        update(state => ({
          ...state,
          currentTrack: station,
          playerType: 'audio',
          currentTime: 0,
          duration: 0,
          isPlaying: false
        }));
      }

      // Play the audio
      try {
        await audioElement.play();
        update(state => ({ ...state, isPlaying: true, error: null }));
      } catch (error) {
        console.error('Play error:', error);
        update(state => ({ 
          ...state, 
          isPlaying: false,
          error: 'Failed to play audio'
        }));
      }
    },

    pauseRadio() {
      if (audioElement) {
        audioElement.pause();
        update(state => ({ ...state, isPlaying: false }));
      }
    },

    seekRadio(time: number) {
      if (audioElement) {
        audioElement.currentTime = time;
      }
    },

    setVolume(volume: number) {
      if (audioElement) {
        audioElement.volume = Math.max(0, Math.min(1, volume));
      }
    }
  };
}

export const musicStore = createMusicStore();
