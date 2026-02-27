import { createCharacter } from '../entities/character.js';

export const createUnderwaterScene = ({ rng, bounds, complexity }) => {
  const colors = ['#00bbf9', '#00f5d4', '#9b5de5', '#f15bb5', '#fee440', '#8ac926'];
  const characters = Array.from({ length: complexity.characters + 20 }, (_, i) =>
    createCharacter(rng, bounds, { accent: colors }, i)
  );

  return {
    name: 'Underwater',
    particleStyle: 'bubbles',
    characters,
    particlesTarget: complexity.particles,
    spawnRate: 8,
    backgroundTop: '#43c6ff',
    backgroundBottom: '#0061a8',
    accents: colors
  };
};
