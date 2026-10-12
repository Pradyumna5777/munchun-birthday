import confetti from 'canvas-confetti';

const COLORS = ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad', '#ffe4ec', '#ffffff'];
const FALLBACK = ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad'];

export async function burstFromElement(element) {
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  // Wait for emoji fonts
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (_) {}

  // Test emoji render capability
  let heartShapes, starShapes;
  try {
    heartShapes = [confetti.shapeFromText({ text: '💖', scalar: 2 })];
    starShapes = [confetti.shapeFromText({ text: '✨', scalar: 2 })];
    if (!heartShapes[0] || !starShapes[0]) {
      heartShapes = undefined;
      starShapes = undefined;
    }
  } catch (_) {
    heartShapes = undefined;
    starShapes = undefined;
  }

  // 1. Center burst (always safe — colors only)
  confetti({
    particleCount: 120,
    spread: 360,
    startVelocity: 45,
    origin: { x, y },
    colors: COLORS,
    scalar: 1,
    ticks: 200,
  });

  // 2. Hearts (with fallback)
  setTimeout(() => {
    confetti({
      particleCount: 25,
      spread: 360,
      startVelocity: 35,
      origin: { x, y },
      shapes: heartShapes,
      colors: heartShapes ? undefined : FALLBACK,
      scalar: 1.6,
      ticks: 220,
    });
  }, 120);

  // 3. Stars (with fallback)
  setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 360,
      startVelocity: 30,
      origin: { x, y },
      shapes: starShapes,
      colors: starShapes ? undefined : FALLBACK,
      scalar: 1.4,
      ticks: 240,
    });
  }, 240);
}