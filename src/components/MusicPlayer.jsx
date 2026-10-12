import { useEffect, useRef } from 'react';
import { FaMusic, FaPause } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';

export default function MusicPlayer({ playSignal }) {
  const audioRef = useRef(null);
  const { playing, play, toggle, attachAudio } = useMusic();

  useEffect(() => {
    attachAudio(audioRef.current);
  }, [attachAudio]);

  useEffect(() => {
    if (!playSignal) return;
    play();
  }, [playSignal, play]);

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/music/birthday-song.mp3"
      />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 sm:w-14 sm:h-14 
                   rounded-full glass flex items-center justify-center 
                   text-pink-rose shadow-lg animate-glow"
        aria-label="Toggle music"
      >
        {playing ? <FaPause /> : <FaMusic className="animate-pulse" />}
      </motion.button>
    </>
  );
}