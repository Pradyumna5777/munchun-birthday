import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import FloatingHearts from './components/FloatingHearts';
import WelcomeGate from './components/WelcomeGate';
import Home from './pages/Home';
import Wishes from './pages/Wishes';
import Gallery from './pages/Gallery';
import Memories from './pages/Memories';
import Surprise from './pages/Surprise';
import { MusicProvider } from './context/MusicContext';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════
   ScrollToTop — auto scroll on route change
   ══════════════════════════════════════ */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

/* ══════════════════════════════════════
   FloatingScrollButton — appears after scrolling down
   ══════════════════════════════════════ */
function FloatingScrollButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollUp}
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 
                     w-11 h-11 sm:w-12 sm:h-12 rounded-full 
                     bg-gradient-to-br from-pink-rose to-purple-deep 
                     text-white flex items-center justify-center 
                     shadow-lg shadow-pink-rose/50 
                     ring-1 ring-white/20
                     hover:shadow-xl hover:shadow-pink-rose/70 
                     transition-shadow duration-300"
        >
          {/* Pulsing glow ring */}
          <motion.span
            className="absolute inset-0 rounded-full bg-pink-rose/40 blur-md"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <FaArrowUp className="relative text-sm sm:text-base" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const location = useLocation();
  const [entered, setEntered] = useState(false);

  return (
    <MusicProvider>
      <ScrollToTop />

      {!entered && <WelcomeGate onEnter={() => setEntered(true)} />}

      <div className="relative min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d0a3e] to-[#0f0116] overflow-hidden">
        <FloatingHearts />

        {entered && <MusicPlayer playSignal={entered} />}

        <Navbar />

        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/wishes" element={<PageWrapper><Wishes /></PageWrapper>} />
              <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
              <Route path="/memories" element={<PageWrapper><Memories /></PageWrapper>} />
              <Route path="/surprise" element={<PageWrapper><Surprise /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="relative z-10 text-center py-6 text-white/50 text-sm">
          Munchun ke liye, Pradyumna ne dil se banaya 💖
        </footer>
      </div>

      {entered && <FloatingScrollButton />}
    </MusicProvider>
  );
}