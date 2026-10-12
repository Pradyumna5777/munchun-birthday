import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useMusic } from '../context/MusicContext';

const VOICE_MESSAGE = '/music/audio.mp4';

export default function VoiceMessagePlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const { pause: pauseMusic, resume: resumeMusic } = useMusic();

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;

    if (playing) {
      a.pause();
      setPlaying(false);
      resumeMusic();
    } else {
      pauseMusic();
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {
          resumeMusic();
        });
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    resumeMusic();
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-full glass 
                    ring-1 ring-pink-rose/30 w-full max-w-xs mx-auto">
      <audio
        ref={audioRef}
        src={VOICE_MESSAGE}
        preload="auto"
        onEnded={handleEnded}
      />
      <button
        onClick={toggle}
        aria-label="Play voice message"
        className="relative w-10 h-10 rounded-full flex-shrink-0
                   bg-gradient-to-br from-pink-rose to-purple-deep 
                   flex items-center justify-center text-white
                   shadow-lg shadow-pink-rose/40"
      >
        {playing ? <FaPause size={12} /> : <FaPlay size={12} className="ml-0.5" />}
        {!playing && (
          <motion.span
            className="absolute inset-0 rounded-full bg-pink-rose/40 blur-md"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </button>
      <div className="flex-1">
        <p className="text-xs text-pink-soft font-medium">Meri awaaz suno 💌</p>
        <p className="text-[10px] text-white/50">
          {playing ? 'Sun rahi ho? 🥺' : 'Ek chhota sa message'}
        </p>
      </div>
    </div>
  );
}