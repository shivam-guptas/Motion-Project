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

  drawSoftPattern(scene, elapsed) {
    this.ctx.save();
    this.ctx.globalAlpha = 0.16;
    for (let i = 0; i < 30; i += 1) {
      const x = (i * 90 + Math.sin(elapsed * 0.25 + i) * 20 + this.width) % this.width;
      const y = (i * 64 + Math.cos(elapsed * 0.2 + i) * 12) % this.height;
      this.ctx.fillStyle = scene.accents[i % scene.accents.length];
      this.ctx.beginPath();
      this.ctx.arc(x, y, 10 + (i % 4) * 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  drawParticle(p, style) {
    this.ctx.globalAlpha = p.alpha;
    this.ctx.fillStyle = p.color;
    this.ctx.beginPath();
    if (style === 'sprinkles') {
      this.ctx.roundRect(p.x - p.size, p.y - p.size * 0.4, p.size * 2.1, p.size * 0.9, p.size * 0.5);
    } else {
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    this.ctx.fill();
  }

  render(scene, particles, elapsed) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, scene.backgroundTop);
    grad.addColorStop(1, scene.backgroundBottom);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawSoftPattern(scene, elapsed);

    for (const char of scene.characters) drawCharacter(this.ctx, char);

    for (const p of particles.items) {
      if (!p.active) continue;
      this.drawParticle(p, scene.particleStyle);
    }
    this.ctx.globalAlpha = 1;
  }
}