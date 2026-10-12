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

    // ═══ 1. Big center burst (multicolor, no emoji) ═══
    confetti({
      particleCount: 120,
      spread: 100,
      startVelocity: 45,
      origin: { y: 0.6 },
      colors: ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad', '#ffe4ec', '#ffffff'],
      scalar: 1.1,
      ticks: 200,
    });

    // ═══ 2. Continuous side cannons ═══
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

    // ═══ 3. Emoji-based confetti (hearts, stars, roses) ═══
    //    Fire ONLY after fonts are guaranteed loaded.
    //    Uses color-only fallback if emoji fails.
    const fireEmojiBursts = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (_) {}

      // Sanity check: can we actually render emoji?
      let supportsEmoji = true;
      try {
        const test = confetti.shapeFromText({ text: '💖', scalar: 2 });
        if (!test) supportsEmoji = false;
      } catch (_) {
        supportsEmoji = false;
      }

      // If emoji works → use emoji shapes
      // If emoji fails → use plain colored circles/squares (NO white boxes)
      const heartShapes = supportsEmoji
        ? [confetti.shapeFromText({ text: '💖', scalar: 2 })]
        : undefined;
      const starShapes = supportsEmoji
        ? [confetti.shapeFromText({ text: '✨', scalar: 2 })]
        : undefined;
      const roseShapes = supportsEmoji
        ? [confetti.shapeFromText({ text: '🌸', scalar: 2 })]
        : undefined;

      const fallbackColors = ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad'];

      // Heart burst from sides (not top)
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 90,
          startVelocity: 35,
          origin: { y: 0.55 },
          shapes: heartShapes,
          colors: heartShapes ? undefined : fallbackColors,
          scalar: 1.6,
          ticks: 220,
        });
      }, 150);

      // Rose + star sprinkle from mid (not top)
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 120,
          startVelocity: 25,
          origin: { y: 0.3 },
          shapes: roseShapes && starShapes
            ? [...roseShapes, ...starShapes]
            : undefined,
          colors: (roseShapes && starShapes) ? undefined : fallbackColors,
          scalar: 1.4,
          ticks: 260,
          gravity: 0.6,
        });
      }, 350);

      // Occasional heart drop — NOW from sides only (not top)
      // Top-falling emoji was causing white blobs on iOS/Safari
      const heartDrops = setInterval(() => {
        if (Math.random() > 0.6) {
          confetti({
            particleCount: 3,
            angle: Math.random() > 0.5 ? 60 : 120,
            spread: 55,
            startVelocity: 45,
            origin: {
              x: Math.random() > 0.5 ? 0 : 1,
              y: Math.random() * 0.4 + 0.3, // from sides, mid-height
            },
            shapes: heartShapes,
            colors: heartShapes ? undefined : fallbackColors,
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