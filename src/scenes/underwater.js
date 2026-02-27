import { createCharacter } from '../entities/character.js';

export const createUnderwaterScene = ({ rng, bounds, complexity }) => {
  const characterCount = complexity.characters;
  const particlesTarget = complexity.particles;
  const characters = Array.from({ length: characterCount }, (_, i) => createCharacter(rng, bounds, {
    accent: ['#96f2d7', '#7ec8e3', '#ffc8dd', '#ffdf91', '#d0f4de']
  }, i));

  return {
    name: 'Underwater',
    particleStyle: 'bubbles',
    characters,
    particlesTarget,
    spawnRate: 8
  };
};
