import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function DancingCharacters() {
  // Random dance sequences
  const leftMoves = useMemo(
    () => ({
      rotate: [0, -8, 8, -6, 6, 0],
      y: [0, -12, 0, -10, 0],
      x: [-6, 6, -6, 6, -6],
      scale: [1, 1.06, 1, 1.04, 1],
    }),
    []
  );

  const rightMoves = useMemo(
    () => ({
      rotate: [0, 8, -8, 6, -6, 0],
      y: [0, -10, 0, -14, 0],
      x: [6, -6, 6, -6, 6],
      scale: [1, 1.04, 1, 1.06, 1],
    }),
    []
  );

  return (
    <div className="relative flex items-end justify-center gap-6 sm:gap-10 my-6">
      {/* ─── Left dancer (Boy) ─── */}
      <motion.div
        animate={leftMoves}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        {/* Shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                        w-14 h-2 bg-pink-rose/30 rounded-full blur-md" />
        {/* Body */}
        <div className="text-5xl sm:text-7xl drop-shadow-[0_0_15px_rgba(255,143,171,0.5)]">
          🕺
        </div>
      </motion.div>

      {/* ─── Center: musical notes floating ─── */}
      <div className="relative">
        {['🎵', '🎶', '💖', '✨'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-3xl"
            style={{
              left: `${(i - 1.5) * 20}px`,
              bottom: 0,
            }}
            animate={{
              y: [0, -60, -100],
              opacity: [0, 1, 0],
              scale: [0.6, 1.1, 0.8],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* ─── Right dancer (Girl) ─── */}
      <motion.div
        animate={rightMoves}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.15,
        }}
        className="relative"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        {/* Shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                        w-14 h-2 bg-purple-soft/30 rounded-full blur-md" />
        {/* Body */}
        <div className="text-5xl sm:text-7xl drop-shadow-[0_0_15px_rgba(224,195,252,0.5)]">
          💃
        </div>
      </motion.div>
    </div>
  );
}