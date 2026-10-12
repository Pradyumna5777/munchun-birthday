import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// Custom shapes: hearts + stars drawn on canvas for premium feel
const heartShape = confetti.shapeFromText({ text: '💖', scalar: 2 });
const starShape = confetti.shapeFromText({ text: '✨', scalar: 2 });
const roseShape = confetti.shapeFromText({ text: '🌸', scalar: 2 });

const COLORS = ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad', '#ffe4ec', '#ffffff'];

export default function Confetti({ trigger }) {
  const rafRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const duration = 4000; // longer = more magical
    const end = Date.now() + duration;

    // 🎯 1. Big center burst (instant, wow moment)
    confetti({
      particleCount: 120,
      spread: 100,
      startVelocity: 45,
      origin: { y: 0.6 },
      colors: COLORS,
      scalar: 1.1,
      ticks: 200,
    });

    // 💖 2. Heart burst — right after
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

    // 🌸 3. Flower + star sprinkle from top
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

    // 🔥 4. Continuous side cannons (while loop)
    const frame = () => {
      // Left cannon
      confetti({
        particleCount: 6,
        angle: 55,
        spread: 70,
        startVelocity: 55,
        origin: { x: 0, y: 0.7 },
        colors: COLORS,
        scalar: 0.9,
      });

      // Right cannon
      confetti({
        particleCount: 6,
        angle: 125,
        spread: 70,
        startVelocity: 55,
        origin: { x: 1, y: 0.7 },
        colors: COLORS,
        scalar: 0.9,
      });

      // 💫 5. Occasional heart from top
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

      if (Date.now() < end) {
        rafRef.current = requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger]);

  return null;
}