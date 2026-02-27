import { createCharacter } from '../entities/character.js';

export const createCandylandScene = ({ rng, bounds, complexity }) => {
  const characters = Array.from({ length: complexity.characters }, (_, i) => createCharacter(rng, bounds, {
    accent: ['#ffafcc', '#a2d2ff', '#ffc8dd', '#cdb4db', '#bde0fe']
  }, i));

  return {
    name: 'Candyland',
    particleStyle: 'sprinkles',
    characters,
    particlesTarget: complexity.particles,
    spawnRate: 12
  };
};
