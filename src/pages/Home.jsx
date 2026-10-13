import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaBirthdayCake, FaGift, FaHeart, FaStar, FaMusic } from 'react-icons/fa';
import DancingCharacters from '../components/DancingCharacters';

// Rotating greeting lines
const GREETINGS = [
  'Meri jaan, meri Pragati Singh 🌸',
  2000,
  'Tum ho toh sab kuch hai ✨',
  2000,
  'Tumhari smile = meri duniya 💕',
  2000,
  'Aaj tumhe sabse khush rakhta hoon 🎉',
  2000,
  'I love you Munchun, hamesha 💗',
  2000,
];

// Sparkles config
const SPARKLE_COUNT = 25;

export default function Home() {
  const [timeGreeting, setTimeGreeting] = useState('');
  const [timeLabel, setTimeLabel] = useState('');

  // Live greeting based on time of day
  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours();
      if (hour < 5) {
        setTimeGreeting('Raat ke iss pyaare se waqt mein,');
        setTimeLabel('🌙 Raat');
      } else if (hour < 12) {
        setTimeGreeting('Subah ki pehli roshni ke saath,');
        setTimeLabel('🌅 Subah');
      } else if (hour < 17) {
        setTimeGreeting('Dopahar ki thandi chhaon mein,');
        setTimeLabel('☀️ Dopahar');
      } else if (hour < 21) {
        setTimeGreeting('Shaam ki rangeen roshni mein,');
        setTimeLabel('🌆 Shaam');
      } else {
        setTimeGreeting('Taaron bhari raat ke saath,');
        setTimeLabel('✨ Raat');
      }
    };
    update();
    const interval = setInterval(update, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Random sparkles
  const sparkles = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 1.5 + Math.random() * 2.5,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  // Orbiting hearts around cake
  const orbits = [
    { angle: 0, delay: 0, emoji: '💖' },
    { angle: 90, delay: 0.4, emoji: '🌸' },
    { angle: 180, delay: 0.8, emoji: '✨' },
    { angle: 270, delay: 1.2, emoji: '💫' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative pt-20 pb-12 overflow-hidden">
      {/* ═══ Ambient glow blobs ═══ */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-0 w-80 h-80 bg-pink-rose/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-soft/25 rounded-full blur-3xl"
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 
                      bg-pink-deep/15 rounded-full blur-3xl" />

      {/* ═══ Sparkles layer ═══ */}
      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              boxShadow: '0 0 8px rgba(255,255,255,0.9)',
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 0.4] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ═══ Main content ═══ */}
      <div className="relative z-10 text-center max-w-3xl w-full">

        {/* ═══ Floating 3D Cake with orbits ═══ */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.1, type: 'spring', stiffness: 120 }}
          className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-6"
        >
          {/* Big glow behind cake */}
          <motion.span
            className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-rose to-purple-deep blur-3xl"
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.85, 1.1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Rotating dashed ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-pink-rose/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          {/* Orbiting hearts around cake */}
          {orbits.map((o, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 text-lg sm:text-xl"
              style={{ transformOrigin: '0 0' }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
                delay: o.delay,
              }}
            >
              <span
                className="block"
                style={{
                  transform: `rotate(${o.angle}deg) translate(60px) rotate(-${o.angle}deg)`,
                }}
              >
                {o.emoji}
              </span>
            </motion.div>
          ))}

          {/* Floating cake emoji */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -3, 3, 0] }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute inset-0 flex items-center justify-center 
                       text-6xl sm:text-7xl drop-shadow-[0_0_25px_rgba(255,143,171,0.7)]"
          >
            🎂
          </motion.div>
        </motion.div>

        {/* ═══ Live time greeting ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass 
                     text-xs sm:text-sm text-pink-soft/90 mb-4"
        >
          <span>{timeLabel}</span>
          <span className="w-1 h-1 rounded-full bg-pink-rose/60" />
          <span className="italic">{timeGreeting}</span>
        </motion.div>

        {/* ═══ Subheading ═══ */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-2xl text-white/85 mb-3"
        >
          Aaj tumhara din hai, jaan 🌸
        </motion.h2>

        {/* ═══ Big heading ═══ */}
       <motion.h1
  initial={{ opacity: 0, scale: 0.85, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ delay: 0.7, type: 'spring', stiffness: 150 }}
  className="font-fancy text-5xl sm:text-7xl md:text-8xl leading-tight mb-5"
>
  <span className="text-gradient drop-shadow-[0_0_30px_rgba(255,143,171,0.4)]">
    Happy Birthday
  </span>
  <br />
  <span className="text-gradient inline-flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
    <span>Munchun</span>

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
        times: [0, 0.15, 0.3, 0.45, 1],
      }}
      style={{
        filter:
          'drop-shadow(0 0 12px rgba(220, 20, 60, 0.8)) drop-shadow(0 0 24px rgba(220, 20, 60, 0.4))',
        willChange: 'transform',
        transform: 'translateZ(0)',
        lineHeight: 1,
        verticalAlign: 'middle',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
      >
        <path
          d="M12 21s-7.5-4.8-9.8-9.5C.4 8.2 2.2 4.5 5.8 3.7 8 3.2 10 4.2 12 6.7c2-2.5 4-3.5 6.2-3 3.6.8 5.4 4.5 3.6 7.8C19.5 16.2 12 21 12 21z"
          fill="#dc143c"
        />
      </svg>
    </motion.span>
  </span>
</motion.h1>

        {/* ═══ Divider with heart ═══ */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-pink-rose/60" />
          <FaHeart className="text-pink-rose text-xs animate-pulse" />
          <span className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-pink-rose/60" />
        </motion.div>

        <DancingCharacters />


        {/* ═══ Typing animation ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-base sm:text-xl md:text-2xl mb-8 min-h-[3rem] 
                     flex items-center justify-center px-2"
        >
          <TypeAnimation
            sequence={GREETINGS}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-pink-soft font-medium"
          />
        </motion.div>

        {/* ═══ CTA Buttons ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center"
        >
          {/* Primary button */}
          <Link to="/wishes" className="group relative inline-block">
            {/* Glow ring */}
            <motion.span
              className="absolute inset-0 rounded-full bg-pink-rose/50 blur-xl -z-10"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="relative flex items-center justify-center gap-3 
                             px-7 py-4 rounded-full 
                             bg-gradient-to-r from-pink-rose via-purple-deep to-pink-deep 
                             font-semibold text-white 
                             ring-1 ring-white/20 shadow-lg shadow-pink-rose/40 
                             overflow-hidden transition-all duration-300 
                             group-hover:scale-[1.04] group-hover:shadow-2xl group-hover:shadow-pink-rose/60">
              {/* Shimmer */}
              <span className="absolute inset-0 -translate-x-full 
                               group-hover:translate-x-full transition-transform duration-1000 
                               bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <FaBirthdayCake className="relative group-hover:rotate-12 transition" />
              <span className="relative">Meri Wishes Padho</span>
            </span>
          </Link>

          {/* Secondary button (glass) */}
          <Link to="/surprise" className="group relative inline-block">
            <span className="relative flex items-center justify-center gap-3 
                             px-7 py-4 rounded-full glass 
                             font-semibold text-white ring-1 ring-pink-rose/20 
                             hover:bg-white/15 hover:ring-pink-rose/40 
                             transition-all duration-300 
                             group-hover:scale-[1.04] group-hover:shadow-lg 
                             group-hover:shadow-pink-rose/30">
              <FaGift className="group-hover:rotate-12 transition" />
              Surprise Dekho 🎁
            </span>
          </Link>
        </motion.div>

        {/* ═══ Quick hint bar ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-white/50"
        >
          <div className="flex items-center gap-1.5">
            <FaMusic className="text-pink-rose/70" size={10} />
            <span>Music on karo</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-1.5">
            <FaStar className="text-pink-rose/70" size={10} />
            <span>Photo tap karo</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-1.5">
            <FaHeart className="text-pink-rose/70" size={10} />
            <span>Kahani padho</span>
          </div>
        </motion.div>

        {/* ═══ Signature ═══ */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-8 font-fancy text-xl sm:text-2xl text-pink-soft/80"
        >
          — Tumhara, hamesha 💗
        </motion.p>
      </div>
    </div>
  );
}