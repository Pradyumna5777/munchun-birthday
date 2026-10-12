import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaPlay, FaGift } from 'react-icons/fa';

const FLOAT_EMOJIS = ['💖', '🌸', '✨', '💕', '🎀', '💫', '🌷', '💗'];

const IS_ANDROID =
  typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

const IS_LOW_END =
  typeof navigator !== 'undefined' &&
  (navigator.hardwareConcurrency || 4) <= 4;

export default function WelcomeGate({ onEnter }) {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ═══ Mount delay — browser ko render hone ka time do ═══
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // ═══ Reduce counts aggressively on Android ═══
  const FLOATER_COUNT = IS_ANDROID ? (IS_LOW_END ? 5 : 8) : 14;
  const SPARKLE_COUNT = IS_ANDROID ? (IS_LOW_END ? 8 : 14) : 30;

  const floaters = useMemo(
    () =>
      Array.from({ length: FLOATER_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
        size: 14 + Math.random() * 22,
        emoji: FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)],
        drift: (Math.random() - 0.5) * 60,
      })),
    [FLOATER_COUNT]
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 1.5 + Math.random() * 2,
        size: 2 + Math.random() * 3,
      })),
    [SPARKLE_COUNT]
  );

  const handleEnter = () => {
    setLeaving(true);
    // Android pe thoda faster exit — less flicker window
    const delay = IS_ANDROID ? 500 : 700;
    setTimeout(() => {
      setShow(false);
      onEnter?.();
    }, delay);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // 👈 SIRF opacity — no scale, no blur
          transition={{ duration: IS_ANDROID ? 0.4 : 0.7, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center 
                     px-4 overflow-hidden"
          style={{
            // 👈 Solid gradient via inline style (avoids Tailwind repaints)
            background:
              'linear-gradient(135deg, #1a0a2e 0%, #2d0a3e 50%, #0f0116 100%)',
            // GPU layer promotion
            willChange: 'opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            // 👈 Isolate this layer — prevents parent repaints
            isolation: 'isolate',
            contain: 'strict',
          }}
        >
          {/* ═══ Ambient glow blobs — STATIC on Android ═══ */}
          <div
            className="absolute top-[-8rem] left-[-8rem] w-96 h-96 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,143,171,0.25), transparent 70%)',
              // 👈 No blur class — radial-gradient is cheaper
            }}
          />
          <div
            className="absolute bottom-[-8rem] right-[-8rem] w-[28rem] h-[28rem] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(224,195,252,0.20), transparent 70%)',
            }}
          />

          {/* ═══ Floating layer — animated opacity on mount ═══ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ willChange: 'opacity' }}
          >
            {floaters.map((f) => (
              <motion.div
                key={f.id}
                className="absolute select-none"
                style={{
                  left: `${f.left}%`,
                  fontSize: f.size,
                  opacity: 0.5,
                  willChange: 'transform',
                  // Force GPU layer
                  transform: 'translate3d(0,0,0)',
                  backfaceVisibility: 'hidden',
                }}
                initial={{ y: '110vh' }}
                animate={{
                  y: '-15vh',
                  // 👈 Reduced motion complexity on Android
                  x: IS_ANDROID
                    ? [0, f.drift * 0.5, 0, -f.drift * 0.5, 0]
                    : [0, f.drift, 0, -f.drift, 0],
                  rotate: IS_ANDROID
                    ? [0, 0, 0]
                    : [0, 20, 0, -20, 0], // 👈 No rotation on Android
                }}
                transition={{
                  y: {
                    duration: f.duration,
                    delay: f.delay,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  x: { duration: f.duration / 2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: {
                    duration: f.duration / 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                {f.emoji}
              </motion.div>
            ))}

            {sparkles.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: s.size,
                  height: s.size,
                  opacity: 0.9,
                  willChange: 'opacity',
                  transform: 'translate3d(0,0,0)',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  // 👈 No scale on Android — opacity only
                  scale: IS_ANDROID ? 1 : [0.4, 1.4, 0.4],
                }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          {/* ═══ Main card — content stays simple ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              leaving
                ? { opacity: 0, y: -30 }
                : { opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }
            }
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 text-center max-w-md w-full"
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
            }}
          >
            {/* Tagline — using solid color instead of glass on Android */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 mb-6 
                         rounded-full text-xs text-pink-soft/90 tracking-wide
                         ${IS_ANDROID ? 'border border-white/15' : 'glass'}`}
              style={
                IS_ANDROID
                  ? { background: 'rgba(255,255,255,0.08)' }
                  : undefined
              }
            >
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💖
              </motion.span>
              <span>Ek chhota sa tohfa, sirf tumhare liye</span>
            </motion.div>

            {/* Gift Box */}
            <motion.div
              animate={
                leaving
                  ? { scale: 1.2, opacity: 0 }
                  : {
                      scale: [1, 1.04, 1],
                      rotate: [0, -2, 2, 0],
                      y: [0, -5, 0],
                    }
              }
              transition={
                leaving
                  ? { duration: 0.4 }
                  : {
                      scale: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
                      rotate: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
                      y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                    }
              }
              className="relative mx-auto mb-6 w-24 h-24 sm:w-28 sm:h-28"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Glow — radial-gradient instead of blur */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,143,171,0.5), rgba(142,68,173,0.4) 40%, transparent 70%)',
                }}
              />

              {/* Gift icon */}
              <div
                className="relative w-full h-full rounded-3xl 
                            flex items-center justify-center 
                            shadow-lg ring-1 ring-white/20"
                style={{
                  background:
                    'linear-gradient(135deg, #ff8fab 0%, #8e44ad 50%, #c9184a 100%)',
                  transform: 'translateZ(0)',
                }}
              >
                <FaGift className="text-white text-4xl sm:text-5xl" />

                {/* Sparkle dots — static positions, animated opacity */}
                {[0, 90, 180, 270].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const x = Math.cos(rad) * 36;
                  const y = Math.sin(rad) * 36;
                  return (
                    <motion.span
                      key={deg}
                      className="absolute w-1.5 h-1.5 rounded-full bg-white"
                      style={{
                        top: '50%',
                        left: '50%',
                        marginLeft: x,
                        marginTop: y,
                        opacity: 0.9,
                      }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: deg / 360,
                        ease: 'easeInOut',
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* Heading */}
           <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.7 }}
  className="font-fancy text-5xl sm:text-6xl text-gradient mb-3 leading-tight
             flex items-center justify-center gap-3 sm:gap-4"
>
  <span>Hey Munchun</span>

  {/* ═══ Red Pulsing Heart ═══ */}
  <motion.span
    className="inline-block"
    animate={{
      scale: [1, 1.18, 1, 1.12, 1],
    }}
    transition={{
      duration: 1.6,
      repeat: Infinity,
      ease: 'easeInOut',
      times: [0, 0.15, 0.3, 0.45, 1], // double-beat like real heartbeat
    }}
    style={{
      filter: 'drop-shadow(0 0 12px rgba(220, 20, 60, 0.8)) drop-shadow(0 0 24px rgba(220, 20, 60, 0.4))',
      willChange: 'transform',
      transform: 'translateZ(0)',
      lineHeight: 1,
    }}
  >
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10 sm:w-12 sm:h-12"
    >
      <path
        d="M12 21s-7.5-4.8-9.8-9.5C.4 8.2 2.2 4.5 5.8 3.7 8 3.2 10 4.2 12 6.7c2-2.5 4-3.5 6.2-3 3.6.8 5.4 4.5 3.6 7.8C19.5 16.2 12 21 12 21z"
        fill="#dc143c"
      />
    </svg>
  </motion.span>
</motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="text-white/80 mb-8 text-sm sm:text-base leading-relaxed px-4"
            >
              Kuch special banaya hai tumhare liye…
              <br />
              <span className="text-pink-soft/90 italic">
                Bas ek baar tap karo aur dekho ✨
              </span>
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={leaving}
                className="group relative inline-flex items-center gap-3 px-8 py-4 
                           rounded-full font-semibold text-white 
                           shadow-lg shadow-pink-rose/50 
                           ring-1 ring-white/20 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(90deg, #ff8fab 0%, #8e44ad 50%, #c9184a 100%)',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                <span className="absolute inset-0 -translate-x-full 
                                 group-hover:translate-x-full transition-transform duration-1000 
                                 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Pulsing glow — smaller on Android */}
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: IS_ANDROID
                      ? 'rgba(255,143,171,0.25)'
                      : 'radial-gradient(circle, rgba(255,143,171,0.4), transparent 70%)',
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                <FaPlay className="relative group-hover:scale-110 transition" />
                <span className="relative">Andar Aao Na 🥰</span>
                <FaHeart className="relative text-pink-soft animate-pulse" />
              </motion.button>
            </motion.div>

            {/* Headphones hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="mt-8 flex flex-col items-center gap-2"
            >
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-pink-rose/60 to-transparent" />
              <p className="text-white/45 text-xs flex items-center gap-1.5">
                <motion.span
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎧
                </motion.span>
                Music bhi bajegi, headphones laga lo
              </p>
            </motion.div>
          </motion.div>

          {/* Vignette — removed on Android (radial-gradient overlay = expensive) */}
          {!IS_ANDROID && (
            <div className="absolute inset-0 pointer-events-none 
                            bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}