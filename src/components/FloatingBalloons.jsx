import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BALLOON_COLORS = [
  { bg: '#ff8fab', shadow: 'rgba(255,143,171,0.6)' },
  { bg: '#c9184a', shadow: 'rgba(201,24,74,0.6)' },
  { bg: '#e0c3fc', shadow: 'rgba(224,195,252,0.6)' },
  { bg: '#8e44ad', shadow: 'rgba(142,68,173,0.6)' },
  { bg: '#ffe4ec', shadow: 'rgba(255,228,236,0.6)' },
];

function Balloon({ balloon, onPop }) {
  return (
    <motion.button
      onClick={() => onPop(balloon.id)}
      className="absolute cursor-pointer select-none"
      style={{
        left: `${balloon.left}%`,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
      initial={{ y: '110vh', opacity: 0 }}
      animate={{
        y: '-20vh',
        opacity: 1,
        x: [0, balloon.drift, 0, -balloon.drift, 0],
        rotate: [-3, 3, -3],
      }}
      exit={{
        scale: [1, 1.6, 0],
        opacity: [1, 1, 0],
        y: balloon.popY || '-15vh',
      }}
      transition={{
        y: { duration: balloon.duration, delay: balloon.delay, ease: 'linear' },
        x: { duration: balloon.duration / 2, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        viewBox="0 0 60 90"
        className="w-12 h-16 sm:w-14 sm:h-20"
        style={{
          filter: `drop-shadow(0 4px 8px ${balloon.color.shadow})`,
        }}
      >
        {/* Balloon body */}
        <ellipse cx="30" cy="35" rx="22" ry="28" fill={balloon.color.bg} />
        {/* Highlight */}
        <ellipse cx="22" cy="25" rx="6" ry="10" fill="rgba(255,255,255,0.4)" />
        {/* Knot */}
        <path d="M28 63 L32 63 L30 68 Z" fill={balloon.color.bg} />
        {/* String */}
        <path
          d="M30 68 Q 26 78, 30 88"
          stroke={balloon.color.bg}
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </motion.button>
  );
}

export default function FloatingBalloons() {
  const [balloons, setBalloons] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 6,
      duration: 14 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 40,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    }))
  );

  const handlePop = (id) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    // Respawn after 3 seconds
    setTimeout(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: 10 + Math.random() * 80,
          delay: 0,
          duration: 14 + Math.random() * 8,
          drift: (Math.random() - 0.5) * 40,
          color:
            BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        },
      ]);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      <AnimatePresence>
        {balloons.map((b) => (
          <div key={b.id} className="pointer-events-auto">
            <Balloon balloon={b} onPop={handlePop} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}