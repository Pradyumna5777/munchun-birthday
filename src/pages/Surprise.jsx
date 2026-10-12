import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from '../components/Confetti';
import { burstFromElement } from '../components/ConfettiBurst';
import { useMusic } from '../context/MusicContext';
import {
  FaGift,
  FaHeart,
  FaMusic,
  FaStar,
  FaPlay,
  FaPause,
  FaChevronRight,
} from 'react-icons/fa';

/* ═══════════════════════════════════════════
   CONFIG — CHANGE THESE! 👇
   ═══════════════════════════════════════════ */
const TOGETHER_SINCE = new Date('2026-07-20T00:00:00');

const HER_PHOTO = '/photos/munchun (1).jpg';
const POLAROID_CAPTION = 'Meri duniya 🌸';

const VOICE_MESSAGE = '/music/audio.mp4';

/* ═══════════════════════════════════════════
   Multi-stage letter content
   ═══════════════════════════════════════════ */
const LETTER_STAGES = [
  {
    id: 'greeting',
    heading: 'Pragati, meri jaan 💖',
    lines: [
      'Tum meri zindagi ki sabse khoobsurat cheez ho.',
      'Tumhare saath har din ek celebration hai.',
    ],
    cta: 'Aur padho',
  },
  {
    id: 'feelings',
    heading: 'Tum kya ho mere liye? 🌸',
    lines: [
      'Tum meri subah ki pehli soch ho,',
      'aur raat ki aakhri dua.',
      'Tumhare bina sab kuch adhura lagta hai.',
    ],
    cta: 'Aur aage...',
  },
  {
    id: 'promise',
    heading: 'Mera waada 🤝',
    lines: [
      'Main hamesha tumhara saath dunga —',
      'acche dinon mein, aur mushkil waqt mein bhi.',
      'Tumhari har khushi meri khushi hai,',
      'aur tumhara har dukh mera dukh.',
    ],
    cta: 'Ek aur baat...',
  },
  {
    id: 'final',
    heading: 'Aur aakhri baat... 💗',
    lines: [
      'Main tumse itna pyaar karta hoon',
      'jitna shabdon mein kabhi bayaan nahi kar sakta.',
      'Happy Birthday, meri Munchun. 🎂',
    ],
    cta: null,
  },
];

/* ═══════════════════════════════════════════
   Live counter component
   ═══════════════════════════════════════════ */
function LiveCounter() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - TOGETHER_SINCE.getTime();
      if (diff < 0) return;
      setTime({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {[
        { v: time.d, l: 'din' },
        { v: time.h, l: 'ghante' },
        { v: time.m, l: 'min' },
        { v: time.s, l: 'sec' },
      ].map((t, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl glass flex items-center justify-center 
                          text-base sm:text-lg font-bold text-pink-soft 
                          ring-1 ring-pink-rose/30">
            {pad(t.v)}
          </div>
          <span className="text-[10px] sm:text-xs text-white/50 mt-1">{t.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Falling rose petals background
   ═══════════════════════════════════════════ */
function FallingPetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 6,
        size: 14 + Math.random() * 14,
        emoji: ['🌸', '🌷', '🌹', '💐'][Math.floor(Math.random() * 4)],
        drift: (Math.random() - 0.5) * 80,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none opacity-40"
          style={{ left: `${p.left}%`, fontSize: p.size }}
          initial={{ y: '-10vh' }}
          animate={{
            y: '110vh',
            x: [0, p.drift, 0, -p.drift, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            y: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: p.duration / 2, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: p.duration / 3, repeat: Infinity, ease: 'linear' },
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Voice message player — WITH seeker + music ducking
   ═══════════════════════════════════════════ */
function VoiceMessagePlayer() {
  const audioRef = useRef(null);
  const barRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const { pause: pauseMusic, resume: resumeMusic } = useMusic();

  /* ─── Time formatting: 65 → 1:05 ─── */
  const formatTime = (sec) => {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  /* ─── Audio event listeners ─── */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => {
      if (!dragging) setCurrent(a.currentTime || 0);
    };
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
      resumeMusic();
    };

    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('durationchange', onLoaded);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);

    if (a.readyState >= 1) setDuration(a.duration || 0);

    return () => {
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('durationchange', onLoaded);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnd);
    };
  }, [dragging, resumeMusic]);

  /* ─── Play / Pause with music ducking ─── */
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
        .catch(() => resumeMusic());
    }
  };

  /* ─── Seek from pointer position ─── */
  const seekFromEvent = (clientX) => {
    const a = audioRef.current;
    const bar = barRef.current;
    if (!a || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    a.currentTime = newTime;
    setCurrent(newTime);
  };

  /* ─── Pointer events (mouse + touch + stylus) ─── */
  const handlePointerDown = (e) => {
    setDragging(true);
    seekFromEvent(e.clientX);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (!dragging) return;
    seekFromEvent(e.clientX);
  };
  const handlePointerUp = (e) => {
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const progressPct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 px-4 py-4 rounded-2xl glass 
                    ring-1 ring-pink-rose/30 w-full max-w-md mx-auto">

      {/* Row: play button + label + time */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause voice message' : 'Play voice message'}
          className="relative w-11 h-11 rounded-full flex-shrink-0
                     bg-gradient-to-br from-pink-rose to-purple-deep 
                     flex items-center justify-center text-white
                     shadow-lg shadow-pink-rose/40
                     active:scale-95 transition-transform"
        >
          {playing ? (
            <FaPause size={13} />
          ) : (
            <FaPlay size={13} className="ml-0.5" />
          )}

          {!playing && (
            <motion.span
              className="absolute inset-0 rounded-full bg-pink-rose/40 blur-md"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-pink-soft font-medium truncate">
            Meri awaaz suno 💌
          </p>
          <p className="text-[11px] text-white/50 truncate">
            {playing
              ? 'Sun rahi ho? 🥺'
              : current > 0
              ? 'Pause kiya… phir se suno 💗'
              : 'Ek chhota sa message'}
          </p>
        </div>

        <div className="text-[11px] text-white/60 font-mono tabular-nums select-none">
          {formatTime(current)} / {formatTime(duration)}
        </div>
      </div>

      {/* ═══ Seek bar ═══ */}
      <div
        ref={barRef}
        role="slider"
        aria-label="Seek voice message"
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration) || 0}
        aria-valuenow={Math.floor(current)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onKeyDown={(e) => {
          const a = audioRef.current;
          if (!a) return;
          if (e.key === 'ArrowRight') {
            a.currentTime = Math.min(duration, a.currentTime + 5);
            setCurrent(a.currentTime);
          } else if (e.key === 'ArrowLeft') {
            a.currentTime = Math.max(0, a.currentTime - 5);
            setCurrent(a.currentTime);
          } else if (e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        className="relative h-6 flex items-center cursor-pointer select-none 
                   touch-none outline-none focus-visible:ring-2 
                   focus-visible:ring-pink-rose/60 rounded-full"
      >
        {/* Track background */}
        <div className="relative w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
          {/* Filled progress */}
          <div
            className="absolute inset-y-0 left-0 rounded-full 
                       bg-gradient-to-r from-pink-rose via-pink-deep to-purple-deep"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Thumb / knob */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 
                     w-4 h-4 rounded-full bg-white 
                     shadow-lg shadow-pink-rose/60 
                     ring-2 ring-pink-rose pointer-events-none"
          style={{ left: `calc(${progressPct}% - 8px)` }}
          animate={
            dragging
              ? { scale: 1.35 }
              : hovering
              ? { scale: 1.2 }
              : { scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {/* glow ring */}
          <motion.span
            className="absolute inset-0 rounded-full bg-pink-rose/50 blur-md"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={VOICE_MESSAGE}
        preload="metadata"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Surprise Page
   ═══════════════════════════════════════════ */
export default function Surprise() {
  const [stage, setStage] = useState('closed');
  const [trigger, setTrigger] = useState(false);
  const [letterStage, setLetterStage] = useState(0);
  const giftRef = useRef(null);

  const orbits = useMemo(
    () => [
      { angle: 0, delay: 0, emoji: '✨' },
      { angle: 72, delay: 0.4, emoji: '💫' },
      { angle: 144, delay: 0.8, emoji: '⭐' },
      { angle: 216, delay: 1.2, emoji: '🌟' },
      { angle: 288, delay: 1.6, emoji: '💖' },
    ],
    []
  );

  const handleOpen = () => {
    burstFromElement(giftRef.current);
    setTrigger(true);
    setTimeout(() => setTrigger(false), 100);
    setStage('opening');
    setTimeout(() => setStage('opened'), 800);
  };

  const replayConfetti = () => {
    setTrigger(true);
    setTimeout(() => setTrigger(false), 100);
  };

  const nextLetterStage = () => {
    if (letterStage < LETTER_STAGES.length - 1) {
      setLetterStage((s) => s + 1);
      setTrigger(true);
      setTimeout(() => setTrigger(false), 100);
    }
  };

  const currentLetter = LETTER_STAGES[letterStage];
  const isLastStage = letterStage === LETTER_STAGES.length - 1;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
      <Confetti trigger={trigger} />
      <FallingPetals />

      {/* Ambient blobs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 -left-20 w-80 h-80 bg-pink-rose/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 -right-20 w-96 h-96 bg-purple-deep/20 rounded-full blur-3xl pointer-events-none"
      />

      <AnimatePresence mode="wait">
        {stage !== 'opened' ? (
          /* ═══════════════════════════════════════
             STAGE 1 + 2: CLOSED / OPENING
             ═══════════════════════════════════════ */
          <motion.div
            key="closed"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 15, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass 
                         text-xs text-pink-soft/90 mb-6"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎁
              </motion.span>
              Sirf tumhare liye
            </motion.div>

            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-fancy text-5xl sm:text-7xl text-gradient mb-4"
            >
              Ek Chhota Sa Surprise 🎁
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 mb-12 text-base sm:text-lg italic"
            >
              Sirf tumhare liye, Munchun 💝
            </motion.p>

            {/* Gift box with orbits */}
            <div className="relative mx-auto w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-pink-rose/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-6 rounded-full border border-purple-soft/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />

              {orbits.map((o, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 text-lg sm:text-xl"
                  style={{ transformOrigin: '0 0' }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: o.delay,
                  }}
                >
                  <span
                    className="block"
                    style={{
                      transform: `rotate(${o.angle}deg) translate(100px) rotate(-${o.angle}deg)`,
                    }}
                  >
                    {o.emoji}
                  </span>
                </motion.div>
              ))}

              <motion.div
                className="absolute inset-8 rounded-full bg-gradient-to-br 
                           from-pink-rose via-purple-deep to-pink-deep blur-2xl"
                animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.button
                ref={giftRef}
                onClick={handleOpen}
                disabled={stage === 'opening'}
                whileHover={{ scale: 1.06, rotate: 3 }}
                whileTap={{ scale: 0.94 }}
                animate={
                  stage === 'opening'
                    ? { scale: [1, 1.3, 1.15], rotate: [0, -10, 15, -5, 0] }
                    : { y: [0, -12, 0] }
                }
                transition={
                  stage === 'opening'
                    ? { duration: 0.8, ease: 'easeInOut' }
                    : { y: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }
                }
                className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-3xl 
                           bg-gradient-to-br from-pink-rose via-purple-deep to-pink-deep 
                           shadow-2xl shadow-pink-rose/60 ring-1 ring-white/30
                           flex items-center justify-center overflow-hidden"
              >
                <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-white/30" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/20" />
                <FaGift className="text-white text-7xl sm:text-8xl relative drop-shadow-lg" />
              </motion.button>

              {stage === 'closed' && (
                <motion.div
                  className="absolute -top-2 -right-2 px-3 py-1.5 rounded-full 
                             bg-white text-pink-deep text-xs font-bold 
                             shadow-lg shadow-pink-rose/50"
                  animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Kholo Na! 🥺
                </motion.div>
              )}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-xs text-white/50"
            >
              Gift box pe tap karo 💗
            </motion.p>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════
             STAGE 3: OPENED — Multi-Stage Letter + Extras
             ═══════════════════════════════════════ */
          <motion.div
            key="opened"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 15 }}
            className="text-center max-w-2xl relative z-10 w-full"
          >
            <motion.div
              initial={{ rotate: 0, scale: 0.5, opacity: 0 }}
              animate={{ rotate: [0, 8, -8, 0], scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl sm:text-7xl mb-4 
                         drop-shadow-[0_0_30px_rgba(255,143,171,0.7)]"
            >
              💝
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-fancy text-4xl sm:text-6xl text-gradient mb-6 leading-tight"
            >
              Happy Birthday Munchun! 🎂
            </motion.h2>

            {/* Polaroid photo */}
            <motion.div
              initial={{ y: 30, opacity: 0, rotate: -6 }}
              animate={{ y: 0, opacity: 1, rotate: -3 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              whileHover={{ rotate: 0, scale: 1.03 }}
              className="relative mx-auto mb-8 w-48 sm:w-56 
                         bg-white/95 rounded-lg p-3 pb-12 
                         shadow-2xl shadow-pink-rose/40
                         ring-1 ring-white/50"
            >
              <img
                src={HER_PHOTO}
                alt="Munchun"
                className="w-full aspect-square object-cover rounded"
                onError={(e) => {
                  e.target.style.background =
                    'linear-gradient(135deg, #ff8fab, #8e44ad)';
                }}
              />
              <p className="absolute bottom-2 left-0 right-0 text-center 
                            font-fancy text-lg text-pink-deep">
                {POLAROID_CAPTION}
              </p>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 
                              w-16 h-5 bg-pink-rose/40 rotate-[-2deg] 
                              rounded-sm shadow-sm" />
            </motion.div>

            {/* Together since counter */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <p className="text-xs text-white/50 mb-3 flex items-center justify-center gap-2">
                <FaHeart className="text-pink-rose" size={10} />
                Tumse milne ke baad se…
              </p>
              <LiveCounter />
            </motion.div>

            {/* Multi-stage love letter */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative glass rounded-3xl p-6 sm:p-8 mb-6 
                         border border-pink-rose/30 overflow-hidden
                         shadow-2xl shadow-pink-rose/20"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] 
                              bg-gradient-to-r from-transparent via-pink-rose to-transparent" />

              <div className="absolute top-3 left-3 text-pink-rose/40 text-xs">✦</div>
              <div className="absolute top-3 right-3 text-pink-rose/40 text-xs">✦</div>
              <div className="absolute bottom-3 left-3 text-pink-rose/40 text-xs">✦</div>
              <div className="absolute bottom-3 right-3 text-pink-rose/40 text-xs">✦</div>

              <div className="flex justify-center gap-2 mb-5">
                {LETTER_STAGES.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === letterStage
                        ? 'w-8 bg-pink-rose'
                        : i < letterStage
                        ? 'w-1.5 bg-pink-rose/60'
                        : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLetter.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                  transition={{ duration: 0.5 }}
                  className="text-left space-y-3 min-h-[140px]"
                >
                  <p className="text-lg sm:text-xl font-semibold text-pink-soft mb-3">
                    {currentLetter.heading}
                  </p>
                  {currentLetter.lines.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.1 }}
                      className="text-white/85 leading-relaxed text-sm sm:text-base"
                    >
                      {line}
                    </motion.p>
                  ))}
                </motion.div>
              </AnimatePresence>

              {!isLastStage && (
                <motion.button
                  onClick={nextLetterStage}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 
                             px-5 py-3 rounded-full 
                             bg-gradient-to-r from-pink-rose to-purple-deep 
                             font-semibold text-white text-sm
                             shadow-lg shadow-pink-rose/40 
                             ring-1 ring-white/20
                             group"
                >
                  <span>{currentLetter.cta}</span>
                  <FaChevronRight className="group-hover:translate-x-1 transition" />
                </motion.button>
              )}

              {isLastStage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 pt-4 border-t border-pink-rose/20 
                             flex items-center justify-end gap-2"
                >
                  <span className="text-xs text-pink-soft/70">— Tumhara, hamesha</span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    💗
                  </motion.span>
                </motion.div>
              )}
            </motion.div>

            {/* Voice message with seeker */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="mb-6"
            >
              <VoiceMessagePlayer />
            </motion.div>

            {isLastStage && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="text-2xl sm:text-3xl font-fancy text-gradient mb-6"
              >
                Tumhara, Hamesha 💕
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <motion.button
                onClick={replayConfetti}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center gap-2 
                           px-6 py-3 rounded-full 
                           bg-gradient-to-r from-pink-rose via-purple-deep to-pink-deep 
                           font-semibold text-white text-sm
                           shadow-lg shadow-pink-rose/50 ring-1 ring-white/20 overflow-hidden"
              >
                <span className="absolute inset-0 -translate-x-full 
                                 group-hover:translate-x-full transition-transform duration-1000 
                                 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <FaStar className="relative group-hover:rotate-180 transition duration-500" />
                <span className="relative">Aur Confetti! 🎉</span>
              </motion.button>

              <div className="inline-flex items-center justify-center gap-2 px-6 py-3 
                              rounded-full glass text-sm text-pink-soft/80 
                              ring-1 ring-pink-rose/20">
                <FaMusic className="text-pink-rose/70" size={12} />
                <span>Music chalu hai 🎧</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}