import { oscillate } from '../utils/math.js';

export const createCharacter = (rng, bounds, palette, index) => ({
  id: index,
  x: rng.range(0.1, 0.9) * bounds.width,
  y: rng.range(0.2, 0.85) * bounds.height,
  baseY: 0,
  size: rng.range(30, 74),
  hue: rng.pick(palette.accent),
  speed: rng.range(0.4, 1.2),
  phase: rng.range(0, Math.PI * 2)
});

export const updateCharacter = (char, elapsed, bounds) => {
  char.baseY ||= char.y;
  char.x += Math.sin(elapsed * char.speed + char.phase) * 0.12;
  if (char.x < char.size) char.x = bounds.width - char.size;
  if (char.x > bounds.width - char.size) char.x = char.size;
  char.y = char.baseY + oscillate(elapsed, char.speed * 0.8, 8, char.phase);
};

export const drawCharacter = (ctx, char) => {
  const eyeR = char.size * 0.12;
  ctx.save();
  ctx.translate(char.x, char.y);

  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.roundRect(-char.size * 0.55, -char.size * 0.45, char.size * 1.1, char.size * 0.9, char.size * 0.35);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-char.size * 0.2, -char.size * 0.05, eyeR, 0, Math.PI * 2);
  ctx.arc(char.size * 0.2, -char.size * 0.05, eyeR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2d2a32';
  ctx.beginPath();
  ctx.arc(-char.size * 0.2, -char.size * 0.02, eyeR * 0.45, 0, Math.PI * 2);
  ctx.arc(char.size * 0.2, -char.size * 0.02, eyeR * 0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#2d2a32';
  ctx.lineWidth = Math.max(2, char.size * 0.05);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, char.size * 0.15, char.size * 0.18, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  ctx.restore();
};
