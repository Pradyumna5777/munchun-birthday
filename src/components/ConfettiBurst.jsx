import confetti from 'canvas-confetti';

const IS_IOS =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

const COLORS = ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad', '#ffe4ec', '#ffffff'];
const FALLBACK = ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad'];

export async function burstFromElement(element) {
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  // ═══ Main center burst — SAME for all ═══
  confetti({
    particleCount: 120,
    spread: 360,
    startVelocity: 45,
    origin: { x, y },
    colors: COLORS,
    scalar: 1,
    ticks: 200,
  });

  // ═══ iOS: colored secondary waves (no emoji) ═══
  if (IS_IOS) {
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 360,
        startVelocity: 35,
        origin: { x, y },
        colors: FALLBACK,
        scalar: 1.3,
        ticks: 220,
      });
    }, 120);

    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 360,
        startVelocity: 28,
        origin: { x, y },
        colors: FALLBACK,
        scalar: 1.1,
        ticks: 240,
      });
    }, 240);
    return;
  }

  // ═══ Non-iOS: SAME old emoji effect ═══
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (_) {}

  const heartShape = confetti.shapeFromText({ text: '💖', scalar: 2 });
  const starShape = confetti.shapeFromText({ text: '✨', scalar: 2 });

  setTimeout(() => {
    confetti({
      particleCount: 25,
      spread: 360,
      startVelocity: 35,
      origin: { x, y },
      shapes: [heartShape],
      scalar: 1.6,
      ticks: 220,
    });
  }, 120);

  setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 360,
      startVelocity: 30,
      origin: { x, y },
      shapes: [starShape],
      scalar: 1.4,
      ticks: 240,
    });
  }, 240);
}