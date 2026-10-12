import { motion } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';

const EMOJIS = ['💖', '💕', '🌸', '✨', '💗', '🎀', '🌷', '💫'];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rnd = (min, max) => Math.random() * (max - min) + min;

export default function FloatingHearts() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const hearts = useMemo(() => {
    const count = isMobile ? 6 : 10;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: rnd(12, 20),
      size: rnd(14, 26),
      emoji: pick(EMOJIS),
      drift: rnd(-25, 25),
    }));
  }, [isMobile]);

  const sparkles = useMemo(() => {
    const count = isMobile ? 8 : 14;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: rnd(2, 4),
      size: rnd(2, 3.5),
    }));
  }, [isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Static blobs — no frame cost */}
      <div className="absolute -top-32 -left-32 w-80 h-80 
                      bg-pink-rose/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 
                      bg-purple-soft/10 rounded-full blur-3xl" />

      {/* Hearts — only transform */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute select-none"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            willChange: 'transform',
          }}
          initial={{ y: '110vh' }}
          animate={{ y: '-15vh', x: [0, h.drift, 0, -h.drift, 0] }}
          transition={{
            y: { duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: h.duration / 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {h.emoji}
        </motion.div>
      ))}

      {/* Sparkles — opacity only */}
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white/80"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            willChange: 'opacity',
          }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}