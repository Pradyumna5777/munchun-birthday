import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function Confetti({ trigger }) {
  const rafRef = useRef(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (!trigger || activeRef.current) return;
    activeRef.current = true;

    const duration = 3000;
    const end = Date.now() + duration;

    // ═══ Wait for emoji font to be ready (prevents white boxes) ═══
    const startConfetti = () => {
      // 1. Center burst (big)
      confetti({
        particleCount: 120,
        spread: 100,
        startVelocity: 45,
        origin: { y: 0.6 },
        colors: ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad', '#ffe4ec', '#ffffff'],
        scalar: 1.1,
        ticks: 200,
      });

      // 2. Side cannons (continuous)
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
    };

    // ═══ Ensure emoji font is loaded before using emoji shapes ═══
    const loadEmojiAndFire = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (_) {
        // ignore
      }

      // Now it's safe to use emoji shapes
      const heartShape = confetti.shapeFromText({ text: '💖', scalar: 2 });
      const starShape = confetti.shapeFromText({ text: '✨', scalar: 2 });
      const roseShape = confetti.shapeFromText({ text: '🌸', scalar: 2 });

      // Fire big emoji bursts (same as before)
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

      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 120,
          startVelocity: 25,
          origin: { y: 0.1 },
          shapes: [roseShape, starShape],
          scalar: 1.4,
          ticks: 260,
          gravity: 0.6,
        });
      }, 350);

      // Random heart drops from top
      const heartDrops = setInterval(() => {
        if (Math.random() > 0.7) {
          confetti({
            particleCount: 2,
            spread: 60,
            startVelocity: 20,
            origin: { x: Math.random(), y: -0.05 },
            shapes: [heartShape],
            scalar: 1.4,
            gravity: 0.5,
            ticks: 300,
          });
        }
      }, 400);

      setTimeout(() => clearInterval(heartDrops), duration - 500);

      // Start regular confetti too
      startConfetti();
    };

    loadEmojiAndFire();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      activeRef.current = false;
    };
  }, [trigger]);

  return null;
}