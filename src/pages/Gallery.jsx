import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Photos public/photos/ folder se aayengi
const photos = [
  { src: '/photos/munchuni (1).PNG', caption: 'Pehli yaad 🌸' },
  { src: '/photos/munchun (8).PNG', caption: 'Pyaare pal 💕' },
  { src: '/photos/munchun (10).PNG', caption: 'Hamesha saath ✨' },
  { src: '/photos/munchuni (3).PNG', caption: 'Tumhari smile 🥰' },
  { src: '/photos/munchun (3).jpg', caption: 'Meri favourite 💖' },
  { src: '/photos/munchun (9).PNG', caption: 'Meri jaan 🌷' },
  { src: '/photos/munchun (1).jpg', caption: 'Teri ek jhalak 💫' },
  { src: '/photos/munchun (7).PNG', caption: 'Meri khargosh 🐰' },
  { src: '/photos/munchun (2).jpg', caption: 'Dil ki rani 👑' },
  { src: '/photos/munchun (6).PNG', caption: 'Sabse pyaari 💗' },
  { src: '/photos/munchun (11).PNG', caption: 'Teri smile = meri khushi 😊' },
  { src: '/photos/couple.png', caption: 'Meri jaan, meri Munchun 💖' },
];

export default function Gallery() {
  const [selected, setSelected] = useState(null); // index of open photo
  const [loadedImages, setLoadedImages] = useState({}); // track loaded state

  // Navigation in lightbox
  const handlePrev = () =>
    setSelected((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  const handleNext = () =>
    setSelected((prev) => (prev === photos.length - 1 ? 0 : prev + 1));

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (selected === null) return;
    if (e.key === 'Escape') setSelected(null);
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  useMemo(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selected]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      {/* ═══ Header ═══ */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-fancy text-5xl sm:text-7xl text-gradient mb-3"
      >
        Hamari Yaadein 📸
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-white/70 mb-4 text-sm sm:text-base"
      >
        Har photo ek kahani hai, Munchun 💞
      </motion.p>

      {/* Photo counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs sm:text-sm text-pink-soft">
          <FaHeart className="text-pink-rose animate-pulse" size={10} />
          <span>{photos.length} pyaari yaadein</span>
        </div>
      </motion.div>

      {/* ═══ Masonry grid ═══ */}
      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              delay: (i % 6) * 0.08,
              duration: 0.6,
              ease: 'easeOut',
            }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => setSelected(i)}
            className="relative rounded-3xl overflow-hidden group break-inside-avoid cursor-pointer
                       shadow-lg shadow-pink-rose/10 hover:shadow-2xl hover:shadow-pink-rose/40
                       ring-1 ring-white/5 hover:ring-pink-rose/40
                       transition-all duration-500"
          >
            {/* Loading shimmer */}
            {!loadedImages[i] && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 
                              animate-pulse" />
            )}

            <img
              src={p.src}
              alt={p.caption}
              loading="lazy"
              onLoad={() => setLoadedImages((prev) => ({ ...prev, [i]: true }))}
              className={`w-full h-auto object-cover transition-all duration-700 
                          group-hover:scale-110 
                          ${loadedImages[i] ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}
            />

            {/* Pink gradient overlay (subtle always) */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-deep/30 via-transparent to-transparent 
                            opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

            {/* Desktop: caption on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent
                            opacity-0 group-hover:opacity-100 transition duration-500
                            hidden sm:flex flex-col justify-end p-4">
              <p className="text-white font-semibold text-sm sm:text-base translate-y-3 
                            group-hover:translate-y-0 transition duration-500">
                {p.caption}
              </p>
              <p className="text-pink-soft/80 text-xs translate-y-3 
                            group-hover:translate-y-0 transition duration-500 delay-75">
                Tap to view full 📷
              </p>
            </div>

            {/* Mobile: caption always visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3
                            bg-gradient-to-t from-black/80 to-transparent
                            sm:hidden">
              <p className="text-white text-xs font-medium">{p.caption}</p>
            </div>

            {/* Heart badge top-right on hover */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              whileHover={{ scale: 1, rotate: 0 }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full glass 
                         flex items-center justify-center opacity-0 group-hover:opacity-100 
                         transition duration-500"
            >
              <FaHeart className="text-pink-rose text-xs" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ═══ Closing line ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <div className="w-16 h-[1px] mx-auto mb-4 bg-gradient-to-r from-transparent via-pink-rose/60 to-transparent" />
        <p className="font-fancy text-2xl sm:text-3xl text-gradient">
          Aur bhi bahut yaadein baaki hain… 💖
        </p>
      </motion.div>

      {/* ═══════════════════════════════════════
          LIGHTBOX — Fullscreen photo viewer
          ═══════════════════════════════════════ */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl 
                       flex items-center justify-center px-4 py-16"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(null);
              }}
              className="absolute top-4 right-4 w-11 h-11 rounded-full glass 
                         flex items-center justify-center text-white 
                         hover:bg-pink-rose/30 transition z-10"
            >
              <FaTimes size={18} />
            </motion.button>

            {/* Counter badge */}
            <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full glass 
                            text-xs text-white/80 z-10">
              {selected + 1} / {photos.length}
            </div>

            {/* Prev button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-6 w-11 h-11 rounded-full glass 
                         flex items-center justify-center text-white 
                         hover:bg-pink-rose/30 transition z-10"
            >
              <FaChevronLeft size={16} />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-6 w-11 h-11 rounded-full glass 
                         flex items-center justify-center text-white 
                         hover:bg-pink-rose/30 transition z-10"
            >
              <FaChevronRight size={16} />
            </button>

            {/* Image */}
            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <img
                src={photos[selected].src}
                alt={photos[selected].caption}
                className="w-full max-h-[75vh] object-contain rounded-2xl 
                           shadow-2xl shadow-pink-rose/30 ring-1 ring-white/10"
              />

              {/* Caption bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-center"
              >
                <p className="font-fancy text-2xl sm:text-3xl text-gradient">
                  {photos[selected].caption}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}