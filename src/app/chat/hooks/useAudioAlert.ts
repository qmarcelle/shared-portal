import { useCallback, useRef, useState } from 'react';

/**
 * A hook to manage audio alert sounds
 * @param audioSrc URL of the audio file to play
 * @returns Object with methods to initialize and play audio
 */
export const useAudioAlert = (audioSrc: string) => {
  const [initialized, setInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Initializes the audio element
   * Should be called after user interaction to comply with autoplay policies
   */
  const initializeAudio = useCallback(() => {
    if (!initialized && typeof window !== 'undefined') {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.muted = true;
      audioRef.current.play().catch(() => {
        // Autoplay failed, will need user interaction
      });
      setInitialized(true);
    }
  }, [audioSrc, initialized]);

  /**
   * Plays the audio alert
   */
  const playAlert = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch((error) => {
        console.error('Error playing alert sound:', error);
      });
    }
  }, []);

  return { playAlert, initializeAudio, initialized };
};
