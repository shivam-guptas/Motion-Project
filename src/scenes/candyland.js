import { createCharacter } from '../entities/character.js';

export const createCandylandScene = ({ rng, bounds, complexity }) => {
  const colors = ['#ff4d6d', '#ffb700', '#4cc9f0', '#80ed99', '#b5179e', '#ffd166'];
  const characters = Array.from({ length: complexity.characters + 20 }, (_, i) =>
    createCharacter(rng, bounds, { accent: colors }, i)
  );

  return {
    name: 'Candyland',
    particleStyle: 'sprinkles',
    characters,
    particlesTarget: complexity.particles,
    spawnRate: 12,
    backgroundTop: '#ff99c8',
    backgroundBottom: '#ff7096',
    accents: colors
  };
};