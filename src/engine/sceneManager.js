import { createRng } from './rng.js';
import { ParticlePool } from '../entities/particle.js';
import { createUnderwaterScene } from '../scenes/underwater.js';
import { createSpaceScene } from '../scenes/space.js';
import { createCandylandScene } from '../scenes/candyland.js';
import { createExtraScenes } from '../scenes/extraScenes.js';
import { updateCharacter } from '../entities/character.js';

const COMPLEXITY = {
  low: { characters: 3, particles: 90 },
  med: { characters: 6, particles: 160 },
  high: { characters: 10, particles: 260 }
};

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
    this.rng = createRng(this.seed);
    this.sceneBank = [];
    this.rebuildSceneBank();
    this.switchScene(0);
  }

  rebuildSceneBank() {
    const bounds = this.boundsProvider();
    const complexity = this.complexity;
    this.sceneBank = [
      createUnderwaterScene({ rng: this.rng, bounds, complexity }),
      createSpaceScene({ rng: this.rng, bounds, complexity }),
      createCandylandScene({ rng: this.rng, bounds, complexity }),
      ...createExtraScenes({ rng: this.rng, bounds, complexity })
    ];
  }

  get complexity() {
    return COMPLEXITY[this.complexityKey];
  }

  setComplexity(key) {
    this.complexityKey = key;
    this.particlePool.resize(this.complexity.particles);
    this.reseed(this.seed);
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

  reseed(seed) {
    this.seed = seed >>> 0;
    this.rng = createRng(this.seed);
    this.rebuildSceneBank();
  }

  switchScene(index = (this.currentFactoryIndex + 1) % this.sceneBank.length) {
    this.currentFactoryIndex = index;
    this.reseed((this.seed + 2654435761) >>> 0);
    this.scene = this.sceneBank[this.currentFactoryIndex];
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
    const spawnCount = Math.min(8, Math.ceil(this.scene.spawnRate * dt));
    for (let i = 0; i < spawnCount; i += 1) {
      if (this.particlePool.activeCount() >= this.scene.particlesTarget) break;
      this.particlePool.spawn({
        x: this.rng.range(0, bounds.width),
        y: bounds.height + this.rng.range(0, 30),
        vx: this.rng.range(-6, 6),
        vy: this.rng.range(-54, -20),
        size: this.rng.range(2, 8),
        alpha: this.rng.range(0.45, 0.85),
        color: this.scene.characters[this.rng.int(0, this.scene.characters.length - 1)]?.hue || '#fff'
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
      complexity: this.complexityKey,
      sceneIndex: this.currentFactoryIndex + 1,
      sceneTotal: this.sceneBank.length
    };
  }
}
