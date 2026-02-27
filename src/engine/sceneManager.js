import { createRng } from './rng.js';
import { ParticlePool } from '../entities/particle.js';
import { createUnderwaterScene } from '../scenes/underwater.js';
import { createSpaceScene } from '../scenes/space.js';
import { createCandylandScene } from '../scenes/candyland.js';
import { updateCharacter } from '../entities/character.js';

const COMPLEXITY = {
  low: { characters: 5, particles: 80 },
  med: { characters: 8, particles: 140 },
  high: { characters: 12, particles: 220 }
};

const SCENE_FACTORIES = [createUnderwaterScene, createSpaceScene, createCandylandScene];

export class SceneManager {
  constructor(boundsProvider) {
    this.boundsProvider = boundsProvider;
    this.complexityKey = 'med';
    this.seed = Math.floor(Math.random() * 2 ** 31);
    this.scene = null;
    this.sceneAge = 0;
    this.resetAge = 0;
    this.currentFactoryIndex = 0;
    this.particlePool = new ParticlePool(COMPLEXITY[this.complexityKey].particles);
    this.fpsSamples = [];
    this.avgFps = 60;
    this.switchScene();
  }

  get complexity() {
    return COMPLEXITY[this.complexityKey];
  }

  setComplexity(key) {
    this.complexityKey = key;
    this.particlePool.resize(this.complexity.particles);
    this.switchScene(this.currentFactoryIndex);
  }

  lowerComplexityIfNeeded() {
    if (this.avgFps >= 40) return;
    if (this.complexityKey === 'high') this.setComplexity('med');
    else if (this.complexityKey === 'med') this.setComplexity('low');
  }

  collectFps(dt) {
    this.fpsSamples.push(1 / Math.max(dt, 0.0001));
    if (this.fpsSamples.length > 10) this.fpsSamples.shift();
    this.avgFps = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
  }

  switchScene(index = (this.currentFactoryIndex + 1) % SCENE_FACTORIES.length) {
    this.currentFactoryIndex = index;
    this.seed = (this.seed + 2654435761) >>> 0;
    const rng = createRng(this.seed);
    this.scene = SCENE_FACTORIES[this.currentFactoryIndex]({
      rng,
      bounds: this.boundsProvider(),
      complexity: this.complexity
    });
    this.sceneAge = 0;
    this.particlePool.reset();
  }

  hardReset() {
    this.resetAge = 0;
    this.particlePool.reset();
    this.switchScene(this.currentFactoryIndex);
  }

  spawnParticles(dt) {
    const bounds = this.boundsProvider();
    const spawnCount = Math.min(5, Math.ceil(this.scene.spawnRate * dt));
    for (let i = 0; i < spawnCount; i += 1) {
      if (this.particlePool.activeCount() >= this.scene.particlesTarget) break;
      this.particlePool.spawn({
        x: Math.random() * bounds.width,
        y: bounds.height + Math.random() * 30,
        vx: (Math.random() - 0.5) * 8,
        vy: -20 - Math.random() * 30,
        size: 2 + Math.random() * 6,
        alpha: 0.45 + Math.random() * 0.4,
        color: this.scene.characters[Math.floor(Math.random() * this.scene.characters.length)]?.hue || '#fff'
      });
    }
  }

  updateParticles(dt) {
    const bounds = this.boundsProvider();
    for (const p of this.particlePool.items) {
      if (!p.active) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (this.scene.particleStyle === 'stars') p.vx += Math.sin(p.y * 0.01) * 0.08;
      if (p.y < -40 || p.x < -40 || p.x > bounds.width + 40) p.active = false;
    }
  }

  update(dt, elapsed) {
    this.sceneAge += dt;
    this.resetAge += dt;
    this.collectFps(dt);
    this.lowerComplexityIfNeeded();

    if (this.sceneAge >= 45) this.switchScene();
    if (this.resetAge >= 360) this.hardReset();

    const bounds = this.boundsProvider();
    for (const char of this.scene.characters) updateCharacter(char, elapsed, bounds);
    this.spawnParticles(dt);
    this.updateParticles(dt);
  }

  getHud() {
    return {
      theme: this.scene.name,
      objectCount: this.scene.characters.length,
      particleCount: this.particlePool.activeCount(),
      avgFps: this.avgFps.toFixed(1),
      seed: this.seed,
      complexity: this.complexityKey
    };
  }
}
