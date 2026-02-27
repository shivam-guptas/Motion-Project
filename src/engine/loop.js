import { clamp } from '../utils/math.js';

export class RafLoop {
  constructor(update) {
    this.update = update;
    this.running = false;
    this.last = 0;
    this.elapsed = 0;
    this.raf = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.tick(this.last);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  tick = (now) => {
    if (!this.running) return;
    const dt = clamp((now - this.last) / 1000, 0, 0.033);
    this.last = now;
    this.elapsed += dt;
    this.update(dt, this.elapsed, now);
    this.raf = requestAnimationFrame(this.tick);
  };
}
