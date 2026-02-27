import { createCharacter } from '../entities/character.js';

export const createSpaceScene = ({ rng, bounds, complexity }) => {
  const characters = Array.from({ length: complexity.characters }, (_, i) => createCharacter(rng, bounds, {
    accent: ['#c8b6ff', '#ffd6a5', '#ffadad', '#fdffb6', '#9bf6ff']
  }, i));

  return {
    name: 'Space',
    particleStyle: 'stars',
    characters,
    particlesTarget: complexity.particles,
    spawnRate: 10
  };
};
