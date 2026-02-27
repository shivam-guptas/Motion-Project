import { oscillate } from '../utils/math.js';

const DEFAULT_CHARACTER_TYPES = ['blob', 'car', 'train', 'cat', 'dog', 'bunny', 'fish', 'bird', 'dino', 'robot'];

export const createCharacter = (rng, bounds, palette, index) => ({
  id: index,
  x: rng.range(0.1, 0.9) * bounds.width,
  y: rng.range(0.2, 0.85) * bounds.height,
  baseY: 0,
  size: rng.range(30, 74),
  hue: rng.pick(palette.accent),
  kind: rng.pick(palette.types || DEFAULT_CHARACTER_TYPES),
  speed: rng.range(0.4, 1.2),
  phase: rng.range(0, Math.PI * 2)
});

export const updateCharacter = (char, elapsed, bounds, dt = 0.016) => {
  char.baseY ||= char.y;
  char.baseX ||= char.x;
  char.rotation ||= 0;
  char.scale ||= 1;

  const baseBob = oscillate(elapsed, char.speed * 0.8, 6, char.phase);
  char.x += Math.sin(elapsed * char.speed + char.phase) * 0.08;
  char.y = char.baseY + baseBob;
  char.scale = 1;

  if (char.action === 'bounce') {
    char.y = char.baseY + Math.abs(oscillate(elapsed, char.speed * 1.8, 16, char.phase));
  } else if (char.action === 'hop_right') {
    char.x += (22 + char.speed * 8) * dt;
    char.y = char.baseY + Math.abs(oscillate(elapsed, char.speed * 2.2, 12, char.phase));
  } else if (char.action === 'wave') {
    char.rotation = oscillate(elapsed, char.speed * 1.4, 0.18, char.phase);
  } else if (char.action === 'spin') {
    char.rotation += dt * (1.8 + char.speed * 0.5);
  } else if (char.action === 'clap') {
    char.scale = 1 + Math.abs(oscillate(elapsed, char.speed * 2, 0.12, char.phase));
  } else if (char.action === 'march') {
    char.x += Math.sin(elapsed * char.speed * 2 + char.phase) * 1.1;
    char.y = char.baseY + Math.abs(oscillate(elapsed, char.speed * 2.5, 10, char.phase));
  } else {
    char.rotation *= 0.92;
  }

  if (char.x < char.size) char.x = bounds.width - char.size;
  if (char.x > bounds.width - char.size) char.x = char.size;
};

export const drawCharacter = (ctx, char) => {
  ctx.save();
  ctx.translate(char.x, char.y);
  ctx.rotate(char.rotation || 0);
  const scale = char.scale || 1;
  ctx.scale(scale, scale);

  if (char.kind === 'car') drawCar(ctx, char);
  else if (char.kind === 'train') drawTrain(ctx, char);
  else if (char.kind === 'cat') drawCat(ctx, char);
  else if (char.kind === 'dog') drawDog(ctx, char);
  else if (char.kind === 'bunny') drawBunny(ctx, char);
  else if (char.kind === 'fish') drawFish(ctx, char);
  else if (char.kind === 'bird') drawBird(ctx, char);
  else if (char.kind === 'dino') drawDino(ctx, char);
  else if (char.kind === 'robot') drawRobot(ctx, char);
  else drawBlob(ctx, char);

  ctx.restore();
};

const drawEye = (ctx, x, y, r) => {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2d2a32';
  ctx.beginPath();
  ctx.arc(x, y + r * 0.2, r * 0.45, 0, Math.PI * 2);
  ctx.fill();
};

const drawBlob = (ctx, char) => {
  const eyeR = char.size * 0.12;
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.roundRect(-char.size * 0.55, -char.size * 0.45, char.size * 1.1, char.size * 0.9, char.size * 0.35);
  ctx.fill();
  drawEye(ctx, -char.size * 0.2, -char.size * 0.05, eyeR);
  drawEye(ctx, char.size * 0.2, -char.size * 0.05, eyeR);
  ctx.strokeStyle = '#2d2a32';
  ctx.lineWidth = Math.max(2, char.size * 0.05);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, char.size * 0.15, char.size * 0.18, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
};

const drawCar = (ctx, char) => {
  const w = char.size * 1.3;
  const h = char.size * 0.62;
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.roundRect(-w * 0.5, -h * 0.2, w, h, h * 0.3);
  ctx.fill();
  ctx.fillStyle = '#bde0fe';
  ctx.beginPath();
  ctx.roundRect(-w * 0.2, -h * 0.45, w * 0.4, h * 0.4, h * 0.12);
  ctx.fill();
  ctx.fillStyle = '#2d2a32';
  ctx.beginPath();
  ctx.arc(-w * 0.28, h * 0.42, h * 0.2, 0, Math.PI * 2);
  ctx.arc(w * 0.28, h * 0.42, h * 0.2, 0, Math.PI * 2);
  ctx.fill();
  drawEye(ctx, -w * 0.12, h * 0.02, h * 0.1);
  drawEye(ctx, w * 0.12, h * 0.02, h * 0.1);
};

const drawTrain = (ctx, char) => {
  const w = char.size * 1.35;
  const h = char.size * 0.65;
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.roundRect(-w * 0.48, -h * 0.22, w * 0.7, h * 0.95, h * 0.18);
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.roundRect(w * 0.2, 0, w * 0.28, h * 0.52, h * 0.14);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-w * 0.35, -h * 0.1, w * 0.18, h * 0.22, h * 0.05);
  ctx.roundRect(-w * 0.13, -h * 0.1, w * 0.18, h * 0.22, h * 0.05);
  ctx.fill();
  ctx.fillStyle = '#2d2a32';
  ctx.beginPath();
  ctx.arc(-w * 0.25, h * 0.5, h * 0.18, 0, Math.PI * 2);
  ctx.arc(0, h * 0.5, h * 0.18, 0, Math.PI * 2);
  ctx.arc(w * 0.26, h * 0.5, h * 0.18, 0, Math.PI * 2);
  ctx.fill();
};

const drawCat = (ctx, char) => {
  const s = char.size;
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.43, 0, Math.PI * 2);
  ctx.moveTo(-s * 0.3, -s * 0.2);
  ctx.lineTo(-s * 0.45, -s * 0.5);
  ctx.lineTo(-s * 0.12, -s * 0.34);
  ctx.moveTo(s * 0.3, -s * 0.2);
  ctx.lineTo(s * 0.45, -s * 0.5);
  ctx.lineTo(s * 0.12, -s * 0.34);
  ctx.fill();
  drawEye(ctx, -s * 0.16, -s * 0.02, s * 0.09);
  drawEye(ctx, s * 0.16, -s * 0.02, s * 0.09);
  ctx.strokeStyle = '#2d2a32';
  ctx.lineWidth = Math.max(2, s * 0.04);
  ctx.beginPath();
  ctx.moveTo(-s * 0.08, s * 0.15);
  ctx.lineTo(0, s * 0.09);
  ctx.lineTo(s * 0.08, s * 0.15);
  ctx.stroke();
};

const drawDog = (ctx, char) => {
  const s = char.size;
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.roundRect(-s * 0.45, -s * 0.36, s * 0.9, s * 0.78, s * 0.28);
  ctx.fill();
  ctx.fillStyle = '#ffdf91';
  ctx.beginPath();
  ctx.ellipse(-s * 0.4, -s * 0.08, s * 0.15, s * 0.25, 0.4, 0, Math.PI * 2);
  ctx.ellipse(s * 0.4, -s * 0.08, s * 0.15, s * 0.25, -0.4, 0, Math.PI * 2);
  ctx.fill();
  drawEye(ctx, -s * 0.16, -s * 0.03, s * 0.09);
  drawEye(ctx, s * 0.16, -s * 0.03, s * 0.09);
};

const drawBunny = (ctx, char) => {
  const s = char.size;
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.roundRect(-s * 0.16, -s * 0.85, s * 0.14, s * 0.58, s * 0.08);
  ctx.roundRect(s * 0.02, -s * 0.85, s * 0.14, s * 0.58, s * 0.08);
  ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2);
  ctx.fill();
  drawEye(ctx, -s * 0.13, -s * 0.02, s * 0.08);
  drawEye(ctx, s * 0.13, -s * 0.02, s * 0.08);
};

const drawFish = (ctx, char) => {
  const s = char.size;
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.46, s * 0.3, 0, 0, Math.PI * 2);
  ctx.moveTo(s * 0.44, 0);
  ctx.lineTo(s * 0.74, -s * 0.2);
  ctx.lineTo(s * 0.74, s * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd60a';
  ctx.beginPath();
  ctx.moveTo(-s * 0.08, -s * 0.08);
  ctx.lineTo(s * 0.16, -s * 0.28);
  ctx.lineTo(s * 0.22, -s * 0.05);
  ctx.fill();
  drawEye(ctx, -s * 0.2, -s * 0.03, s * 0.08);
};

const drawBird = (ctx, char) => {
  const s = char.size;
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.45, s * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(s * 0.35, 0);
  ctx.lineTo(s * 0.56, -s * 0.06);
  ctx.lineTo(s * 0.56, s * 0.06);
  ctx.closePath();
  ctx.fill();
  drawEye(ctx, -s * 0.12, -s * 0.06, s * 0.08);
};

const drawDino = (ctx, char) => {
  const s = char.size;
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.roundRect(-s * 0.5, -s * 0.22, s * 0.82, s * 0.56, s * 0.2);
  ctx.roundRect(s * 0.14, -s * 0.45, s * 0.36, s * 0.36, s * 0.14);
  ctx.fill();
  ctx.fillStyle = '#ffdf91';
  ctx.beginPath();
  ctx.arc(-s * 0.35, s * 0.18, s * 0.08, 0, Math.PI * 2);
  ctx.arc(-s * 0.12, s * 0.18, s * 0.08, 0, Math.PI * 2);
  ctx.fill();
  drawEye(ctx, s * 0.28, -s * 0.32, s * 0.07);
};

const drawRobot = (ctx, char) => {
  const s = char.size;
  ctx.fillStyle = '#c7d3dd';
  ctx.beginPath();
  ctx.roundRect(-s * 0.45, -s * 0.4, s * 0.9, s * 0.82, s * 0.12);
  ctx.fill();
  ctx.fillStyle = char.hue;
  ctx.beginPath();
  ctx.roundRect(-s * 0.34, -s * 0.28, s * 0.68, s * 0.3, s * 0.08);
  ctx.fill();
  ctx.strokeStyle = '#2d2a32';
  ctx.lineWidth = Math.max(2, s * 0.04);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.4);
  ctx.lineTo(0, -s * 0.56);
  ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(0, -s * 0.6, s * 0.06, 0, Math.PI * 2);
  ctx.fill();
  drawEye(ctx, -s * 0.14, -s * 0.12, s * 0.08);
  drawEye(ctx, s * 0.14, -s * 0.12, s * 0.08);
};
