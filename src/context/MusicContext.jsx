import { createContext, useContext, useRef, useState, useCallback } from 'react';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const wasPlayingBeforePause = useRef(false);

  const attachAudio = useCallback((el) => {
    audioRef.current = el;
  }, []);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  }, []);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    wasPlayingBeforePause.current = !a.paused;
    a.pause();
    setPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (!wasPlayingBeforePause.current) return;
    play();
    wasPlayingBeforePause.current = false;
  }, [play]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, pause, play]);

  return (
    <MusicContext.Provider
      value={{ playing, play, pause, resume, toggle, attachAudio }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider');
  return ctx;
}