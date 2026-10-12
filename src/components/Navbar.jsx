import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHeart,
  FaBars,
  FaXmark,
  FaGift,
  FaHouse,
  FaCakeCandles,
  FaCamera,
  FaBook,
} from 'react-icons/fa6';

const links = [
  { to: '/', label: 'Ghar', icon: FaHouse },
  { to: '/wishes', label: 'Wishes', icon: FaCakeCandles },
  { to: '/gallery', label: 'Yaadein', icon: FaCamera },
  { to: '/memories', label: 'Kahani', icon: FaBook },
  { to: '/surprise', label: 'Surprise', icon: FaGift },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Auto-close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Detect scroll to add depth effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeLink = links.find((l) => l.to === location.pathname);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-lg shadow-pink-rose/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Animated gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-rose to-transparent opacity-60" />

        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* ═══ Logo with pulse ring ═══ */}
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              {/* Pulse ring */}
              <motion.span
                className="absolute inset-0 rounded-full bg-pink-rose/40"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="relative w-9 h-9 rounded-full bg-gradient-to-br from-pink-rose to-purple-deep flex items-center justify-center shadow-lg shadow-pink-rose/40"
              >
                <FaHeart className="text-white text-sm" />
              </motion.div>
            </div>
            <span className="font-fancy text-xl sm:text-2xl text-gradient group-hover:scale-105 transition-transform origin-left">
             Pyari Munchun
            </span>
          </NavLink>

          {/* ═══ Desktop links ═══ */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 text-sm">
            {links.map((l) => {
              const Icon = l.icon;
              const isActive = location.pathname === l.to;
              return (
                <NavLink key={l.to} to={l.to} className="relative group">
                  <span
                    className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'text-pink-soft'
                        : 'text-white/75 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`text-xs transition-transform duration-300 ${
                        isActive
                          ? 'scale-110'
                          : 'group-hover:scale-110 group-hover:-rotate-6'
                      }`}
                    />
                    {l.label}
                  </span>

                  {/* Active pill background */}
                  {isActive && (
                    <motion.span
                      layoutId="navActivePill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-rose/30 to-purple-deep/30 ring-1 ring-pink-rose/40"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Hover underline for non-active */}
                  {!isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-pink-rose to-purple-soft rounded-full transition-all duration-300 group-hover:w-1/2" />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* ═══ Mobile hamburger ═══ */}
          <motion.button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="md:hidden relative w-10 h-10 rounded-full glass flex items-center justify-center text-pink-rose"
          >
            <span className="absolute inset-0 rounded-full bg-pink-rose/20 animate-pulse" />
            <FaBars size={18} className="relative" />
          </motion.button>
        </div>

        {/* ═══ Mobile: active page label ═══ */}
        {activeLink && (
          <motion.div
            key={activeLink.to}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="md:hidden px-4 pb-2 -mt-1"
          >
            <p className="text-xs text-pink-soft/80 flex items-center gap-1.5">
              <activeLink.icon className="text-[10px]" />
              {activeLink.label}
            </p>
          </motion.div>
        )}
      </motion.nav>

      {/* ═══════ Mobile Drawer ═══════ */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop with gradient tint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md md:hidden"
            />

            {/* Slide-in panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed top-0 right-0 z-[70] h-full w-80 max-w-[85vw] md:hidden
                         bg-gradient-to-b from-[#1a0a2e] via-[#2d0a3e] to-[#0f0116]
                         border-l border-pink-rose/20 shadow-2xl shadow-pink-rose/30
                         flex flex-col p-6 overflow-hidden"
            >
              {/* Ambient glow blobs inside drawer */}
              <div className="absolute top-0 -right-20 w-56 h-56 bg-pink-rose/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 -left-20 w-56 h-56 bg-purple-deep/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-pink-rose/40"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-pink-rose to-purple-deep flex items-center justify-center shadow-lg shadow-pink-rose/40">
                      <FaHeart className="text-white text-xs" />
                    </div>
                  </div>
                  <span className="font-fancy text-2xl text-gradient">
                    Munchun
                  </span>
                </div>

                <motion.button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-pink-rose"
                >
                  <FaXmark size={16} />
                </motion.button>
              </div>

              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="relative text-xs text-white/50 mb-6 italic"
              >
                Kahan jaana hai, meri jaan? 💕
              </motion.p>

              {/* Nav links */}
              <nav className="relative flex flex-col gap-2">
                {links.map((l, i) => {
                  const Icon = l.icon;
                  const isActive = location.pathname === l.to;
                  return (
                    <motion.div
                      key={l.to}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.08 * i + 0.15,
                        type: 'spring',
                        stiffness: 300,
                        damping: 22,
                      }}
                    >
                      <NavLink
                        to={l.to}
                        className={`group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl text-base font-medium transition-all duration-300 overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-rose/40 to-purple-deep/40 text-pink-soft shadow-lg shadow-pink-rose/25 ring-1 ring-pink-rose/30'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {/* Hover shimmer */}
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                        <Icon
                          className={`relative text-sm transition-transform duration-300 ${
                            isActive
                              ? 'scale-110'
                              : 'group-hover:scale-110 group-hover:-rotate-6'
                          }`}
                        />
                        <span className="relative">{l.label}</span>

                        {isActive && (
                          <motion.span
                            layoutId="drawerActiveDot"
                            className="relative ml-auto w-1.5 h-1.5 rounded-full bg-pink-rose shadow-[0_0_8px_#ff8fab]"
                          />
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom — signature line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative mt-auto pt-6 text-center"
              >
                <div className="w-16 h-[1px] mx-auto mb-3 bg-gradient-to-r from-transparent via-pink-rose/60 to-transparent" />
                <p className="text-[11px] text-white/40 flex items-center justify-center gap-1.5">
                  Made with
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-pink-rose"
                  >
                    💖
                  </motion.span>
                  for Munchun
                </p>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}