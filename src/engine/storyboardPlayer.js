import { createRng } from './rng.js';
import { ParticlePool } from '../entities/particle.js';
import { createCharacter, updateCharacter } from '../entities/character.js';
import { palettes } from '../utils/palette.js';

const FALLBACK_STORYBOARD = {
  title: 'Fallback Storyboard',
  durationSec: 12,
  scenes: [
    { t: 0, dur: 4, bg: 'candyland', chars: [{ id: 'bunny', x: 0.3, y: 0.72, action: 'bounce' }], caption: 'Bounce little bunny!' },
    { t: 4, dur: 4, bg: 'space', chars: [{ id: 'robot', x: 0.5, y: 0.72, action: 'wave' }], caption: 'Wave little robot!' },
    { t: 8, dur: 4, bg: 'underwater', chars: [{ id: 'fish', x: 0.7, y: 0.72, action: 'spin' }], caption: 'Swim little fish!' }
  ]
};

const ID_TO_KIND = {
  bunny: 'bunny',
  rabbit: 'bunny',
  dog: 'dog',
  puppy: 'dog',
  cat: 'cat',
  kitty: 'cat',
  fish: 'fish',
  bird: 'bird',
  dino: 'dino',
  dinosaur: 'dino',
  robot: 'robot',
  car: 'car',
  train: 'train'
};

const getPaletteForScene = (scene) => palettes[(scene.bg || scene.name || 'candyland').toLowerCase()] || palettes.candyland;

const mapKind = (id) => ID_TO_KIND[(id || '').toLowerCase()] || 'blob';

const computeTotalDuration = (storyboard) => {
  if (Number.isFinite(storyboard.durationSec) && storyboard.durationSec > 0) return storyboard.durationSec;
  return storyboard.scenes.reduce((max, scene) => Math.max(max, (scene.t || 0) + (scene.dur || 0)), 0);
};

export class StoryboardPlayer {
  constructor(boundsProvider, storyboard) {
    this.boundsProvider = boundsProvider;
    this.storyboard = storyboard?.scenes?.length ? storyboard : FALLBACK_STORYBOARD;
    this.scenes = [...this.storyboard.scenes].sort((a, b) => (a.t || 0) - (b.t || 0));
    this.totalDuration = Math.max(1, computeTotalDuration(this.storyboard));
    this.seed = 1337;
    this.complexityKey = this.storyboard.complexity || 'med';
    this.activeIndex = 0;
    this.scene = null;
    this.caption = '';
    this.particlePool = new ParticlePool(0);
    this.avgFps = 60;
    this.fpsSamples = [];
    this.setActiveScene(0);
  }

  collectFps(dt) {
    this.fpsSamples.push(1 / Math.max(dt, 0.0001));
    if (this.fpsSamples.length > 10) this.fpsSamples.shift();
    this.avgFps = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
  }

  setComplexity(key) {
    this.complexityKey = key;
  }

  findSceneIndex(timeSec) {
    return this.scenes.findIndex((scene) => {
      const start = scene.t || 0;
      const end = start + (scene.dur || 0);
      return timeSec >= start && timeSec < end;
    });
  }

  buildScene(sceneDef) {
    const bounds = this.boundsProvider();
    const pal = getPaletteForScene(sceneDef);
    const rng = createRng((this.seed + Math.floor((sceneDef.t || 0) * 1000)) >>> 0);
    const chars = (sceneDef.chars || []).map((entry, i) => {
      const char = createCharacter(rng, bounds, { accent: pal.accent }, i);
      char.kind = mapKind(entry.id);
      char.action = entry.action || 'bounce';
      char.x = (entry.x ?? 0.5) * bounds.width;
      char.y = (entry.y ?? 0.75) * bounds.height;
      char.baseX = char.x;
      char.baseY = char.y;
      char.id = entry.id || char.id;
      return char;
    });
    return {
      name: (sceneDef.bg || sceneDef.name || 'candyland').toLowerCase(),
      particleStyle: 'sprinkles',
      characters: chars,
      particlesTarget: 0,
      spawnRate: 0
    };
  }

  setActiveScene(index) {
    const safeIndex = Math.min(Math.max(index, 0), this.scenes.length - 1);
    this.activeIndex = safeIndex;
    const sceneDef = this.scenes[safeIndex];
    this.scene = this.buildScene(sceneDef);
    this.caption = sceneDef?.caption || '';
  }

  switchScene(index = (this.activeIndex + 1) % this.scenes.length) {
    this.setActiveScene(index);
  }

  update(dt, elapsed) {
    this.collectFps(dt);
    const localTime = elapsed % this.totalDuration;
    const idx = this.findSceneIndex(localTime);
    if (idx >= 0 && idx !== this.activeIndex) this.setActiveScene(idx);
    const bounds = this.boundsProvider();
    for (const char of this.scene.characters) updateCharacter(char, elapsed, bounds, dt);
  }

  getHud() {
    return {
      theme: this.scene?.name || 'storyboard',
      objectCount: this.scene?.characters?.length || 0,
      particleCount: 0,
      avgFps: this.avgFps.toFixed(1),
      seed: this.seed,
      complexity: this.complexityKey,
      caption: this.caption
    };
  }
}
