import { createCharacter } from '../entities/character.js';

export const createSpaceScene = ({ rng, bounds, complexity }) => {
  const colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff', '#80ffdb'];
  const characters = Array.from({ length: complexity.characters + 20 }, (_, i) =>
    createCharacter(rng, bounds, { accent: colors }, i)
  );

  return {
    name: 'Space',
    particleStyle: 'stars',
    characters,
    particlesTarget: complexity.particles,
    spawnRate: 10,
    backgroundTop: '#3a0ca3',
    backgroundBottom: '#03045e',
    accents: colors
  };
};
