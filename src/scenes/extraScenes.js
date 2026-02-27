import { createCharacter } from '../entities/character.js';

const EXTRA_SCENE_CONFIGS = [
  { name: 'Rainbow Reef', particleStyle: 'bubbles', spawnRate: 9, colors: ['#ff4d6d', '#ffcc00', '#00f5d4', '#5e60ce', '#48cae4'] },
  { name: 'Moon Garden', particleStyle: 'stars', spawnRate: 8, colors: ['#ffd166', '#cdb4db', '#9bf6ff', '#ffadad', '#bdb2ff'] },
  { name: 'Jellybean Sky', particleStyle: 'sprinkles', spawnRate: 11, colors: ['#ff8fab', '#a0c4ff', '#caffbf', '#fdffb6', '#ffc6ff'] },
  { name: 'Bubble Meadow', particleStyle: 'bubbles', spawnRate: 10, colors: ['#6fffe9', '#5bc0eb', '#fde74c', '#ff5964', '#9bc53d'] },
  { name: 'Comet Parade', particleStyle: 'stars', spawnRate: 9, colors: ['#f15bb5', '#fee440', '#00bbf9', '#00f5d4', '#9b5de5'] },
  { name: 'Cotton Candy Clouds', particleStyle: 'sprinkles', spawnRate: 12, colors: ['#ffafcc', '#ffc8dd', '#bde0fe', '#a2d2ff', '#ffe5ec'] },
  { name: 'Toy Rocket Bay', particleStyle: 'stars', spawnRate: 10, colors: ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'] },
  { name: 'Lemon Lagoon', particleStyle: 'bubbles', spawnRate: 8, colors: ['#ffe066', '#ff922b', '#66d9e8', '#74c0fc', '#63e6be'] },
  { name: 'Starlight Carnival', particleStyle: 'stars', spawnRate: 11, colors: ['#ff4d6d', '#ffd43b', '#4dabf7', '#69db7c', '#e599f7'] },
  { name: 'Cookie Mountains', particleStyle: 'sprinkles', spawnRate: 10, colors: ['#f4a261', '#e76f51', '#e9c46a', '#2a9d8f', '#ffcad4'] },
  { name: 'Neon Pond', particleStyle: 'bubbles', spawnRate: 12, colors: ['#00f5d4', '#00bbf9', '#f15bb5', '#fee440', '#9b5de5'] },
  { name: 'Planet Playground', particleStyle: 'stars', spawnRate: 9, colors: ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'] },
  { name: 'Marshmallow Valley', particleStyle: 'sprinkles', spawnRate: 11, colors: ['#ffc6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf'] },
  { name: 'Sunny Submarine', particleStyle: 'bubbles', spawnRate: 9, colors: ['#ffd60a', '#ff6b6b', '#4cc9f0', '#80ed99', '#f72585'] },
  { name: 'Galaxy Picnic', particleStyle: 'stars', spawnRate: 10, colors: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff'] },
  { name: 'Lollipop Forest', particleStyle: 'sprinkles', spawnRate: 12, colors: ['#ff5d8f', '#ffb700', '#00d1ff', '#7b2cbf', '#64dfdf'] },
  { name: 'Pearl Caves', particleStyle: 'bubbles', spawnRate: 8, colors: ['#caf0f8', '#90e0ef', '#00b4d8', '#0077b6', '#ffafcc'] },
  { name: 'Orbit Friends', particleStyle: 'stars', spawnRate: 9, colors: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'] },
  { name: 'Gummy River', particleStyle: 'sprinkles', spawnRate: 11, colors: ['#ff4d6d', '#ff8fa3', '#ffd166', '#95d5b2', '#74c0fc'] },
  { name: 'Sparkle Harbor', particleStyle: 'bubbles', spawnRate: 10, colors: ['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'] }
];

export const createExtraScenes = ({ rng, bounds, complexity }) => {
  return EXTRA_SCENE_CONFIGS.map((config) => ({
    name: config.name,
    particleStyle: config.particleStyle,
    particlesTarget: complexity.particles,
    spawnRate: config.spawnRate,
    backgroundTop: config.colors[0],
    backgroundBottom: config.colors[3],
    accents: config.colors,
    characters: Array.from({ length: complexity.characters + 20 }, (_, i) => createCharacter(rng, bounds, { accent: config.colors }, i))
  }));
};
