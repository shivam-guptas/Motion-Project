import { createCharacter } from '../entities/character.js';

const EXTRA_SCENE_CONFIGS = [
  { name: 'RainbowRush', particleStyle: 'sprinkles', accent: ['#ff0054', '#ffbd00', '#00f5d4', '#8a2be2', '#39ff14'] },
  { name: 'NeonJungle', particleStyle: 'bubbles', accent: ['#00ff85', '#d4ff00', '#ff7a00', '#00c2ff', '#ff2e88'] },
  { name: 'LavaPop', particleStyle: 'stars', accent: ['#ff2d00', '#ff7b00', '#ffd000', '#ff006e', '#ff9e00'] },
  { name: 'FrozenFizz', particleStyle: 'bubbles', accent: ['#00bbf9', '#48cae4', '#90e0ef', '#caf0f8', '#ade8f4'] },
  { name: 'SkyCarnival', particleStyle: 'sprinkles', accent: ['#ff477e', '#ffd60a', '#06d6a0', '#4cc9f0', '#7209b7'] },
  { name: 'BubbleCity', particleStyle: 'bubbles', accent: ['#ff5d8f', '#ffa62b', '#d0ff14', '#4dffea', '#b388ff'] },
  { name: 'TropicalTwist', particleStyle: 'sprinkles', accent: ['#ff006e', '#ffbe0b', '#3a86ff', '#8338ec', '#06d6a0'] },
  { name: 'CandyComet', particleStyle: 'stars', accent: ['#ff4d6d', '#ffd23f', '#7bff00', '#4cc9f0', '#b5179e'] },
  { name: 'RobotParade', particleStyle: 'stars', accent: ['#00f5ff', '#ffea00', '#ff3d8b', '#72efdd', '#9d4edd'] },
  { name: 'GlowGarden', particleStyle: 'bubbles', accent: ['#38b000', '#70e000', '#ffd60a', '#ff4d6d', '#4cc9f0'] },
  { name: 'PixelParty', particleStyle: 'sprinkles', accent: ['#ff3c38', '#ff8c42', '#f9c80e', '#43bccd', '#845ec2'] },
  { name: 'StarArcade', particleStyle: 'stars', accent: ['#f15bb5', '#fee440', '#00bbf9', '#00f5d4', '#9b5de5'] },
  { name: 'CoralCove', particleStyle: 'bubbles', accent: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#f72585'] },
  { name: 'MagicMeadow', particleStyle: 'sprinkles', accent: ['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'] },
  { name: 'CometCircus', particleStyle: 'stars', accent: ['#ff206e', '#fbff12', '#41ead4', '#b388eb', '#ff9f1c'] },
  { name: 'FireflyForest', particleStyle: 'bubbles', accent: ['#80ffdb', '#f1fa8c', '#ffb703', '#ff6b6b', '#4cc9f0'] },
  { name: 'SunburstBay', particleStyle: 'sprinkles', accent: ['#ff5400', '#ffba08', '#3f88c5', '#9d4edd', '#ff006e'] },
  { name: 'DreamDisco', particleStyle: 'stars', accent: ['#ff4d8d', '#ffc300', '#00d9ff', '#7cff01', '#9d4edd'] },
  { name: 'PrismPlayground', particleStyle: 'sprinkles', accent: ['#ff006e', '#ffbe0b', '#8ac926', '#1982c4', '#6a4c93'] },
  { name: 'AuroraZoo', particleStyle: 'bubbles', accent: ['#00ffa3', '#00c2ff', '#f72585', '#ffd60a', '#7209b7'] }
];

export const createExtraSceneFactories = () => EXTRA_SCENE_CONFIGS.map((config) => ({ rng, bounds, complexity }) => {
  const characterCount = complexity.characters + 2;
  const characters = Array.from({ length: characterCount }, (_, i) => createCharacter(rng, bounds, {
    accent: config.accent
  }, i));

  return {
    name: config.name,
    particleStyle: config.particleStyle,
    characters,
    particlesTarget: complexity.particles + 20,
    spawnRate: 9 + (config.name.length % 5)
  };
});
