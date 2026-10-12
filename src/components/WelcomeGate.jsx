import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaPlay, FaGift } from 'react-icons/fa';

// Floating background emojis
const FLOAT_EMOJIS = ['💖', '🌸', '✨', '💕', '🎀', '💫', '🌷', '💗'];

// Detect low-powered Android devices — reduce workload
const IS_ANDROID =
  typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

export default function WelcomeGate({ onEnter }) {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);

  // ═══ Reduce counts on Android (flicker fix) ═══
  const FLOATER_COUNT = IS_ANDROID ? 8 : 14;
  const SPARKLE_COUNT = IS_ANDROID ? 14 : 30;

  // Random floating emojis
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

  // Twinkling stars
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
    setTimeout(() => {
      setShow(false);
      onEnter?.();
    }, 900);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05, // 👈 reduced from 1.1 (less repaint)
            // 👈 removed blur(10px) — main cause of Android flicker
          }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center 
                     bg-gradient-to-br from-[#1a0a2e] via-[#2d0a3e] to-[#0f0116] 
                     px-4 overflow-hidden"
          style={{
            // 👈 hint browser to composite on GPU
            willChange: 'opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        >
          {/* ═══ Ambient glow blobs ═══ 
              Reduced to 2 (Android), no motion on mobile — biggest flicker culprit */}
          <div
            className="absolute top-[-8rem] left-[-8rem] w-96 h-96 
                       bg-pink-rose/25 rounded-full blur-2xl"
            style={{
              // Static position for Android (no motion = no flicker)
              transform: 'translateZ(0)',
              willChange: IS_ANDROID ? 'auto' : 'transform',
            }}
          />
          <div
            className="absolute bottom-[-8rem] right-[-8rem] w-[28rem] h-[28rem] 
                       bg-purple-soft/20 rounded-full blur-2xl"
            style={{
              transform: 'translateZ(0)',
              willChange: IS_ANDROID ? 'auto' : 'transform',
            }}
          />
          {/* 👈 Removed the 3rd blob — was adding repaint load */}

          {/* ═══ Floating hearts layer ═══ */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floaters.map((f) => (
              <motion.div
                key={f.id}
                className="absolute select-none opacity-50"
                style={{
                  left: `${f.left}%`,
                  fontSize: f.size,
                  willChange: 'transform',
                  transform: 'translateZ(0)', // GPU layer
                }}
                initial={{ y: '110vh' }}
                animate={{
                  y: '-15vh',
                  x: [0, f.drift, 0, -f.drift, 0],
                  rotate: [0, 20, 0, -20, 0],
                }}
                transition={{
                  y: {
                    duration: f.duration,
                    delay: f.delay,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  x: { duration: f.duration / 2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: f.duration / 3, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                {f.emoji}
              </motion.div>
            ))}

            {/* Twinkling sparkles — no box-shadow (expensive on Android) */}
            {sparkles.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: s.size,
                  height: s.size,
                  // 👈 removed box-shadow — was causing per-frame repaints
                  opacity: 0.9,
                  willChange: 'opacity, transform',
                  transform: 'translateZ(0)',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.4, 1.4, 0.4],
                }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* ═══ Main card ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={
              leaving
                ? { opacity: 0, y: -30, scale: 0.94 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10 text-center max-w-md w-full"
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
            }}
          >
            {/* Small tagline */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 
                         rounded-full glass text-xs text-pink-soft/90 tracking-wide"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💖
              </motion.span>
              <span>Ek chhota sa tohfa, sirf tumhare liye</span>
            </motion.div>

            {/* ═══ Gift Box ═══ */}
            <motion.div
              animate={
                leaving
                  ? { scale: 1.3, rotate: 12, opacity: 0 }
                  : {
                      scale: [1, 1.05, 1],       // 👈 reduced from 1.08
                      rotate: [0, -3, 3, 0],     // 👈 reduced from -4/4
                      y: [0, -6, 0],             // 👈 reduced from -10
                    }
              }
              transition={
                leaving
                  ? { duration: 0.6 }
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
              }}
            >
              {/* 👈 Single glow instead of two layers (less repaint) */}
              <div className="absolute inset-0 rounded-full 
                              bg-gradient-to-r from-pink-rose/40 to-purple-deep/40 
                              blur-xl" />

              {/* Gift icon */}
              <div className="relative w-full h-full rounded-3xl 
                              bg-gradient-to-br from-pink-rose via-purple-deep to-pink-deep 
                              flex items-center justify-center 
                              shadow-xl shadow-pink-rose/50 ring-1 ring-white/20"
                   style={{ transform: 'translateZ(0)' }}>
                <FaGift className="text-white text-4xl sm:text-5xl" />

                {/* 👈 Sparkle dots — using left/top instead of translate property */}
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
                        // 👈 removed box-shadow — Android flicker culprit
                        opacity: 0.9,
                      }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
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

            {/* ═══ Heading ═══ */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-fancy text-5xl sm:text-6xl text-gradient mb-3 leading-tight"
            >
              Hey Munchun 💖
            </motion.h1>

            {/* ═══ Subtext ═══ */}
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

            {/* ═══ CTA Button ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                disabled={leaving}
                className="group relative inline-flex items-center gap-3 px-8 py-4 
                           rounded-full bg-gradient-to-r from-pink-rose via-purple-deep to-pink-deep 
                           font-semibold text-white shadow-lg shadow-pink-rose/50 
                           ring-1 ring-white/20 overflow-hidden transition"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Shimmer sweep */}
                <span className="absolute inset-0 -translate-x-full 
                                 group-hover:translate-x-full transition-transform duration-1000 
                                 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* 👈 Reduced blur intensity on glow (was blur-xl) */}
                <motion.span
                  className="absolute inset-0 rounded-full bg-pink-rose/30 blur-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                <FaPlay className="relative group-hover:scale-110 transition" />
                <span className="relative">Andar Aao Na 🥰</span>
                <FaHeart className="relative text-pink-soft animate-pulse" />
              </motion.button>
            </motion.div>

            {/* ═══ Headphones hint ═══ */}
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

          {/* ═══ Vignette overlay ═══ */}
          <div className="absolute inset-0 pointer-events-none 
                          bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}