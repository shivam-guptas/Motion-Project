import { palettes } from '../utils/palette.js';
import { drawCharacter } from '../entities/character.js';

export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.resize();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  render(scene, particles, elapsed) {
    const themeKey = scene.name.toLowerCase();
    const pal = palettes[themeKey];
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, pal.backgroundTop);
    grad.addColorStop(1, pal.backgroundBottom);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.save();
    this.ctx.globalAlpha = 0.2;
    for (let i = 0; i < 22; i += 1) {
      const x = (i * 120 + Math.sin(elapsed * 0.2 + i) * 15) % this.width;
      const y = (i * 90) % this.height;
      this.ctx.fillStyle = pal.accent[i % pal.accent.length];
      this.ctx.beginPath();
      this.ctx.arc(x, y, 14 + (i % 4) * 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();

    for (const char of scene.characters) drawCharacter(this.ctx, char);

    for (const p of particles.items) {
      if (!p.active) continue;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }
}
