import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';

const memories = [
  {
    date: 'Jis Din Mile The',
    text: 'Us din upar wale ne mujhe meri duniya di thi. Thank you universe. 🌟',
    icon: '🌟',
    highlight: false,
  },
  {
    date: 'Pehli Baat',
    text: 'Ghante minute lage the. Us waqt hi samajh gaya — ye ladki special hai. 💬',
    icon: '💬',
    highlight: false,
  },
  {
    date: 'Pehli Call — Aur Dil Khil Gaya 💗',
    text: 'Jab tumne achanak se mujhe pehli baar call kiya… yaar, us waqt kya hi batau. Tumhari itni pyaari awaaz sunkar main aur bhi zyada pyaar mein doob gaya tumhare. Us din samajh aaya — is ladki se pyaar toh ab kabhi kam nahi ho sakta, bas badhta jayega. Tumhari awaaz hi meri favourite dhun hai. 🥺💖',
    icon: '📞',
    highlight: true,
  },
  {
    date: 'Pehla "I Love You"',
    text: 'Dil ne pehli baar aise dhadka tha. Aur ab bas tumhare liye dhadakta hai. 💗',
    icon: '💗',
    highlight: false,
  },
  {
    date: 'Har Hansi Jo Saath Mein',
    text: 'Tumhari hansi meri favourite dhun hai, Munchun. 😄',
    icon: '😄',
    highlight: false,
  },
  {
    date: 'Raat Bhar Baatein',
    text: 'Tumhare saath khamoshi bhi khoobsurat lagti hai. 🌙',
    icon: '🌙',
    highlight: false,
  },
  {
    date: 'Aaj Aur Hamesha',
    text: 'Har din tumhare saath ek yaad hai jo main hamesha jeena chahta hoon. ♾️',
    icon: '♾️',
    highlight: false,
  },
];

export default function Memories() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Track scroll progress of the timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Height of drawn line
  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  // Update numeric progress for display
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (v) => {
      setProgress(Math.round(v * 100));
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      {/* ═══ Ambient background blobs ═══ */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed top-20 -left-20 w-72 h-72 bg-pink-rose/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-20 -right-20 w-80 h-80 bg-purple-soft/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* ═══ Header ═══ */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-fancy text-5xl sm:text-7xl text-gradient mb-3"
      >
        Hamari Kahani 💞
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-white/70 mb-4 text-sm sm:text-base"
      >
        Tumse milne se lekar aaj tak ka safar 🌸
      </motion.p>

      {/* ═══ Progress pill ═══ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-pink-soft/90">
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <span>Safar {progress}% pura hua</span>
        </div>
      </motion.div>

      {/* ═══ Timeline ═══ */}
      <div ref={containerRef} className="max-w-3xl mx-auto relative">
        {/* Base timeline line (faded) */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 
                        bg-gradient-to-b from-pink-rose/20 via-purple-soft/20 to-pink-rose/20" />

        {/* Drawn timeline line (fills as you scroll) */}
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-4 sm:left-1/2 top-0 w-[2px] -translate-x-1/2 
                     bg-gradient-to-b from-pink-rose via-purple-deep to-pink-rose 
                     shadow-[0_0_12px_rgba(255,143,171,0.8)]"
        />

        {memories.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`relative mb-12 sm:mb-16 pl-14 sm:pl-0 sm:w-1/2 ${
              i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:ml-auto sm:pl-12'
            }`}
          >
            {/* ═══ Glowing icon dot ═══ */}
            <div
              className={`absolute top-2 left-2 sm:left-auto w-9 h-9 sm:w-11 sm:h-11 
                          rounded-full z-10
                          bg-gradient-to-br from-pink-rose via-purple-deep to-pink-deep 
                          flex items-center justify-center text-base sm:text-lg 
                          ring-4 ring-[#0f0116]
                          ${i % 2 === 0 ? 'sm:-right-[22px]' : 'sm:-left-[22px]'}
                          `}
            >
              {/* Pulse ring */}
              <motion.span
                className="absolute inset-0 rounded-full bg-pink-rose/60"
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: m.highlight ? 1.5 : 2.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: i * 0.2,
                }}
              />

              {/* Glow behind highlighted dot */}
              {m.highlight && (
                <span className="absolute inset-0 rounded-full bg-pink-rose blur-xl opacity-70" />
              )}

              <span className="relative">{m.icon}</span>
            </div>

            {/* ═══ Card ═══ */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`relative rounded-2xl p-5 sm:p-6 
                          transition-all duration-300 overflow-hidden
                          ${
                            m.highlight
                              ? 'glass border border-pink-rose/60 bg-gradient-to-br from-pink-rose/20 via-purple-deep/10 to-pink-deep/20 shadow-xl shadow-pink-rose/30'
                              : 'glass hover:bg-white/12 hover:shadow-lg hover:shadow-pink-rose/15'
                          }`}
            >
              {/* Highlight card top accent */}
              {m.highlight && (
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px] 
                             bg-gradient-to-r from-transparent via-pink-rose to-transparent"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Floating emoji badge (highlight only) */}
              {m.highlight && (
                <motion.div
                  className="absolute -top-3 right-4 w-7 h-7 rounded-full 
                             bg-gradient-to-br from-pink-rose to-purple-deep 
                             flex items-center justify-center text-xs shadow-lg shadow-pink-rose/40"
                  animate={{ y: [0, -4, 0], rotate: [0, 10, -10, 0] }}
                  transition={{
                    y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                >
                  💖
                </motion.div>
              )}

              {/* Date */}
              <p
                className={`font-bold text-sm sm:text-base mb-3 flex items-center gap-2 ${
                  m.highlight ? 'text-pink-rose' : 'text-pink-soft'
                } ${i % 2 === 0 ? 'sm:justify-end' : ''}`}
              >
                {m.highlight && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    💖
                  </motion.span>
                )}
                {m.date}
              </p>

              {/* Text */}
              <p
                className={`leading-relaxed text-sm sm:text-base ${
                  m.highlight ? 'text-white font-medium' : 'text-white/85'
                }`}
              >
                {m.text}
              </p>

              {/* Highlight extra line */}
              {m.highlight && (
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 pt-3 border-t border-pink-rose/30
                             text-xs italic text-pink-soft flex items-center gap-1.5
                             justify-start sm:justify-end"
                >
                  <FaHeart className="text-pink-rose text-[10px]" />
                  us din se toh main aur bhi zyada tumhara ho gaya 🥰
                </motion.p>
              )}

              {/* Bottom subtle shine */}
              <div className="absolute bottom-0 left-0 right-0 h-px 
                              bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ═══ Closing note ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto mt-20 relative"
      >
        {/* Glow behind closing card */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-rose/30 to-purple-deep/30 blur-2xl -z-10"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="glass rounded-3xl p-8 text-center relative overflow-hidden
                        border border-pink-rose/30">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] 
                          bg-gradient-to-r from-transparent via-pink-rose to-transparent" />

          {/* Floating heart icon */}
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full 
                       bg-gradient-to-br from-pink-rose to-purple-deep mb-4
                       shadow-lg shadow-pink-rose/50"
            animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FaHeart className="text-white text-lg" />
          </motion.div>

          <p className="font-fancy text-3xl sm:text-4xl text-gradient mb-4">
            Aur Kahani Abhi Shuru Hui Hai… 💌
          </p>

          <p className="text-white/85 leading-relaxed italic text-sm sm:text-base px-2">
            "Munchun, tumhari awaaz, tumhari baatein, tumhara pyaar —
            sab kuch meri zindagi ka sabse khoobsurat hissa hai.
            Aur aage jo bhi aayega, sab tumhare saath hi aayega. 💗"
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-pink-rose/60" />
            <span className="text-xs text-pink-soft/80 font-medium">— Tumhara, hamesha</span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-pink-rose/60" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}