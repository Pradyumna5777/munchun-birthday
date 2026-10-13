import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RAIN_EMOJIS = ['💖', '✨', '🌸', '💕', '⭐', '💫', '🌷', '🎀'];

export default function EmojiRain() {
  const [burst, setBurst] = useState([]);

  useEffect(() => {
    const trigger = () => {
      const count = 8 + Math.floor(Math.random() * 6);
      const newBurst = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 3 + Math.random() * 2,
        emoji: RAIN_EMOJIS[Math.floor(Math.random() * RAIN_EMOJIS.length)],
        size: 16 + Math.random() * 18,
      }));
      setBurst(newBurst);

      // Clear after animation
      setTimeout(() => setBurst([]), 5500);
    };

    // First burst after 5 seconds
    const initialTimer = setTimeout(trigger, 5000);

    // Then every 15-20 seconds
    const intervalTimer = setInterval(() => {
      trigger();
    }, 15000 + Math.random() * 5000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[4]">
      <AnimatePresence>
        {burst.map((e) => (
          <motion.div
            key={e.id}
            className="absolute select-none"
            style={{
              left: `${e.left}%`,
              fontSize: e.size,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
            initial={{ y: '-10vh', opacity: 0, rotate: 0 }}
            animate={{
              y: '110vh',
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360],
              x: [0, (Math.random() - 0.5) * 40, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: e.duration,
              delay: e.delay,
              ease: 'easeIn',
            }}
          >
            {e.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}