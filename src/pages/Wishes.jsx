import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaHeart, FaQuoteLeft } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const wishes = [
  {
    emoji: '🌸',
    title: 'Hamesha Khilti Raho',
    text: 'Meri jaan, tum har mausam mein sabse khoobsurat phool ki tarah khilti raho. 🌷',
    color: 'from-pink-rose to-purple-deep',
  },
  {
    emoji: '✨',
    title: 'Chamakti Raho',
    text: 'Tumhari smile se roshni hai meri duniya mein. Aise hi chamakti raho hamesha. ✨',
    color: 'from-purple-soft to-pink-rose',
  },
  {
    emoji: '💖',
    title: 'Mera Pyaar Tumhare Saath',
    text: 'Jitna pyaar tum mujhe deti ho, usse zyada tumhe hamesha milta rahe. Sach mein. 💗',
    color: 'from-pink-deep to-purple-deep',
  },
  {
    emoji: '🎉',
    title: 'Har Din Khushi Ho',
    text: 'Tumhari zindagi mein har din tyohaar jaisa ho. Har pal muskaan ho. 🥳',
    color: 'from-pink-rose to-pink-deep',
  },
  {
    emoji: '🌙',
    title: 'Meethe Sapne',
    text: 'Tumhare sapne chaand jitne khoobsurat ho, aur poore bhi waise hi ho. 🌙',
    color: 'from-purple-deep to-purple-soft',
  },
  {
    emoji: '🌈',
    title: 'Rangeen Zindagi',
    text: 'Tumhari life rainbow jaisi colorful ho — kabhi udaas na ho, kabhi rukna mat. 🌈',
    color: 'from-pink-rose to-purple-soft',
  },
];

/* ══════════════════════════════════════
   Individual Wish Card with 3D Tilt
   ══════════════════════════════════════ */
function WishCard({ wish, index }) {
  const cardRef = useRef(null);

  // Mouse-tracking motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 60, rotateY: -25 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        delay: index * 0.12,
        duration: 0.7,
        type: 'spring',
        stiffness: 80,
        damping: 15,
      }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.03, y: -8 }}
      className="relative group cursor-pointer"
    >
      {/* Glow behind card (visible on hover) */}
      <motion.div
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${wish.color} opacity-0 group-hover:opacity-30 blur-xl transition duration-500`}
      />

      {/* Card body */}
      <div className="relative glass rounded-3xl p-6 sm:p-7 overflow-hidden 
                      border border-white/10 group-hover:border-pink-rose/40
                      transition-colors duration-500 h-full">

        {/* Top gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] 
                         bg-gradient-to-r from-transparent via-pink-rose to-transparent
                         opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Floating corner glow */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl 
                         bg-gradient-to-br ${wish.color} opacity-20 
                         group-hover:opacity-50 transition-opacity duration-500`} />

        {/* Index number watermark */}
        <div className="absolute top-3 right-4 text-6xl sm:text-7xl font-bold 
                        text-white/5 select-none pointer-events-none
                        group-hover:text-white/10 transition-colors duration-500">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Emoji with animated glow ring */}
        <div className="relative inline-block mb-5">
          <motion.span
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${wish.color} blur-lg opacity-60`}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
          />
          <motion.div
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl 
                       bg-white/5 backdrop-blur ring-1 ring-white/10
                       flex items-center justify-center text-3xl sm:text-4xl"
            whileHover={{ scale: 1.1, rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.5 }}
          >
            {wish.emoji}
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-3 text-pink-soft 
                       flex items-center gap-2 relative">
          {wish.title}
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.15,
            }}
          >
            <FaHeart className="text-pink-rose text-xs" />
          </motion.span>
        </h3>

        {/* Text */}
        <p className="text-white/80 leading-relaxed text-sm sm:text-base relative">
          {wish.text}
        </p>

        {/* Bottom shine line */}
        <div className="absolute bottom-0 left-0 right-0 h-px 
                        bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   Main Wishes Page
   ══════════════════════════════════════ */
export default function Wishes() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Ambient background blobs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed top-20 -left-24 w-80 h-80 bg-pink-rose/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-20 -right-24 w-96 h-96 bg-purple-deep/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* Floating emojis in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['💖', '🌸', '✨', '💫', '🎀', '💗'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-20"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0, -15, 0],
              rotate: [0, 20, 0, -20, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* ═══ Header ═══ */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass 
                          text-xs text-pink-soft/90">
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💌
            </motion.span>
            <span>6 dil se likhi wishes</span>
          </div>
        </motion.div>

        <motion.h1
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  className="text-center font-fancy text-5xl sm:text-7xl text-gradient mb-4
             flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
>
  <span>Meri Dil Se Wishes</span>

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
      className="w-10 h-10 sm:w-14 sm:h-14"
    >
      <path
        d="M12 21s-7.5-4.8-9.8-9.5C.4 8.2 2.2 4.5 5.8 3.7 8 3.2 10 4.2 12 6.7c2-2.5 4-3.5 6.2-3 3.6.8 5.4 4.5 3.6 7.8C19.5 16.2 12 21 12 21z"
        fill="#dc143c"
      />
    </svg>
  </motion.span>
</motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/70 mb-14 text-sm sm:text-base italic"
        >
          Har lafz tumhare liye, Munchun 💕
        </motion.p>
      </div>

      {/* ═══ Cards grid ═══ */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                      gap-5 sm:gap-6 relative z-10">
        {wishes.map((w, i) => (
          <WishCard key={i} wish={w} index={i} />
        ))}
      </div>

      {/* ═══ Closing note ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto mt-20 relative z-10"
      >
        {/* Pulsing glow behind */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br 
                     from-pink-rose/30 to-purple-deep/30 blur-2xl -z-10"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="glass rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden
                        border border-pink-rose/30">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] 
                          bg-gradient-to-r from-transparent via-pink-rose to-transparent" />

          {/* Quote icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full 
                       bg-gradient-to-br from-pink-rose to-purple-deep mb-5
                       shadow-lg shadow-pink-rose/50"
          >
            <FaQuoteLeft className="text-white text-lg" />
          </motion.div>

          <p className="font-fancy text-3xl sm:text-4xl text-gradient mb-6">
            Dil Se Ek Baat 💌
          </p>

          {/* Typing effect for the closing note */}
          <div className="min-h-[120px] sm:min-h-[100px] flex items-center justify-center">
            <TypeAnimation
              sequence={[
                'Pragati, tum sirf meri girlfriend nahi ho — tum meri best friend ho, mera sukoon ho, aur meri favourite insaan ho.',
                1000,
                'Tum ho toh sab hai.',
                1500,
                'Janamdin bahut bahut mubarak ho, meri Munchun. 🎂💖',
                3000,
              ]}
              wrapper="p"
              speed={60}
              repeat={Infinity}
              className="text-white/85 leading-relaxed italic text-sm sm:text-base px-2"
            />
          </div>

          {/* Signature */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-pink-rose/60" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💖
            </motion.span>
            <span className="text-xs text-pink-soft/80 font-medium">Tumhara, hamesha</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            >
              💖
            </motion.span>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-pink-rose/60" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}