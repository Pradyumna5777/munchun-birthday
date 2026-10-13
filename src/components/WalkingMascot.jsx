import { motion } from 'framer-motion';

const MASCOT_EMOJIS = ['🧸', '🐰', '🐻', '🐨', '🦊'];

export default function WalkingMascot() {
  const mascot = MASCOT_EMOJIS[Math.floor(Math.random() * MASCOT_EMOJIS.length)];

  return (
    <motion.div
      className="fixed z-[6] pointer-events-none select-none"
      style={{
        bottom: '6rem',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
      initial={{ x: '-10vw', y: 0 }}
      animate={{
        x: ['-10vw', '110vw'],
        y: [0, -8, 0, -8, 0, -8, 0], // bobbing
        rotate: [0, 3, -3, 0, 3, -3, 0], // slight sway
      }}
      transition={{
        x: { duration: 22, ease: 'linear', repeat: Infinity, repeatDelay: 3 },
        y: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div className="relative">
        <div className="text-3xl sm:text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
          {mascot}
        </div>
        {/* Small footprints trail */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-pink-rose/40"
            style={{
              bottom: -6,
              left: -8 - i * 8,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}