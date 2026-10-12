import confetti from 'canvas-confetti';

const heartShape = confetti.shapeFromText({ text: '💖', scalar: 2 });
const starShape = confetti.shapeFromText({ text: '✨', scalar: 2 });

const COLORS = ['#ff8fab', '#c9184a', '#e0c3fc', '#8e44ad', '#ffe4ec', '#ffffff'];

export function burstFromElement(element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  // Center burst
  confetti({
    particleCount: 120,
    spread: 360,
    startVelocity: 45,
    origin: { x, y },
    colors: COLORS,
    scalar: 1,
    ticks: 200,
  });

  // Hearts
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

  // Stars
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