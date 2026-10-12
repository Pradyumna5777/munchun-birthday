import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// iOS pe emoji shapes Safari mein white boxes banate hain → skip
const IS_IOS =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

const COLORS = ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad', '#ffe4ec', '#ffffff'];
const FALLBACK_COLORS = ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad'];

export default function Confetti({ trigger }) {
  const rafRef = useRef(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (!trigger || activeRef.current) return;
    activeRef.current = true;

    const duration = 3000;
    const end = Date.now() + duration;

    // ═══ 1. Big center burst — SAME for all devices ═══
    confetti({
      particleCount: 120,
      spread: 100,
      startVelocity: 45,
      origin: { y: 0.6 },
      colors: COLORS,
      scalar: 1.1,
      ticks: 200,
    });

    // ═══ 2. Continuous side cannons — SAME for all devices ═══
    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 55,
        spread: 70,
        startVelocity: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff8fab', '#c9184a', '#e0c3fc', '#fff'],
        scalar: 0.9,
      });
      confetti({
        particleCount: 6,
        angle: 125,
        spread: 70,
        startVelocity: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff8fab', '#c9184a', '#e0c3fc', '#fff'],
        scalar: 0.9,
      });

      if (Date.now() < end) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        activeRef.current = false;
      }
    };
    frame();

    // ═══ 3. Emoji bursts — ONLY on non-iOS ═══
    const fireEmojiBursts = async () => {
      // iOS: skip emoji shapes → use colored circles instead (no white boxes)
      if (IS_IOS) {
        // iOS gets EXTRA colored confetti (looks festive, no emoji)
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 120,
            startVelocity: 35,
            origin: { y: 0.5 },
            colors: FALLBACK_COLORS,
            scalar: 1.3,
            ticks: 250,
          });
        }, 150);

        setTimeout(() => {
          confetti({
            particleCount: 40,
            spread: 90,
            startVelocity: 30,
            origin: { y: 0.3 },
            colors: FALLBACK_COLORS,
            scalar: 1.2,
            ticks: 280,
            gravity: 0.6,
          });
        }, 350);

        // Extra side sprinkles for iOS — keeps celebration feel
        const iOSDrops = setInterval(() => {
          if (Math.random() > 0.6) {
            confetti({
              particleCount: 4,
              angle: Math.random() > 0.5 ? 60 : 120,
              spread: 55,
              startVelocity: 45,
              origin: {
                x: Math.random() > 0.5 ? 0 : 1,
                y: Math.random() * 0.4 + 0.3,
              },
              colors: FALLBACK_COLORS,
              scalar: 1.2,
              ticks: 260,
            });
          }
        }, 500);

        setTimeout(() => clearInterval(iOSDrops), duration - 500);
        return;
      }

      // ─── Non-iOS (Android, Desktop, Windows) — SAME old emoji effect ───
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (_) {}

      const heartShape = confetti.shapeFromText({ text: '💖', scalar: 2 });
      const starShape = confetti.shapeFromText({ text: '✨', scalar: 2 });
      const roseShape = confetti.shapeFromText({ text: '🌸', scalar: 2 });

      // Heart burst from mid
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 90,
          startVelocity: 35,
          origin: { y: 0.55 },
          shapes: [heartShape],
          scalar: 1.6,
          ticks: 220,
        });
      }, 150);

      // Rose + star sprinkle from mid
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 120,
          startVelocity: 25,
          origin: { y: 0.3 },
          shapes: [roseShape, starShape],
          scalar: 1.4,
          ticks: 260,
          gravity: 0.6,
        });
      }, 350);

      // Occasional heart drops from sides (not top — top caused white)
      const heartDrops = setInterval(() => {
        if (Math.random() > 0.6) {
          confetti({
            particleCount: 3,
            angle: Math.random() > 0.5 ? 60 : 120,
            spread: 55,
            startVelocity: 45,
            origin: {
              x: Math.random() > 0.5 ? 0 : 1,
              y: Math.random() * 0.4 + 0.3,
            },
            shapes: [heartShape],
            scalar: 1.5,
            ticks: 280,
          });
        }
      }, 500);

      setTimeout(() => clearInterval(heartDrops), duration - 500);
    };

    fireEmojiBursts();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      activeRef.current = false;
    };
  }, [trigger]);

  return null;
}