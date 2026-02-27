import { defaultStyleProfile } from './defaultStyleProfile.js';

const THEME_BANK = {
  animals: {
    titleWords: ['Happy', 'Bouncy', 'Sunny', 'Dancing'],
    nouns: ['Zoo', 'Parade', 'Playtime', 'Adventure'],
    backgrounds: ['aurorazoo', 'glowgarden', 'magicmeadow', 'bubblecity']
  },
  vehicles: {
    titleWords: ['Zoom', 'Chug', 'Wheels', 'Racing'],
    nouns: ['Road', 'Town', 'Tracks', 'Trip'],
    backgrounds: ['pixelparty', 'robotparade', 'stararcade', 'sunburstbay']
  },
  colors: {
    titleWords: ['Rainbow', 'Color', 'Bright', 'Sparkly'],
    nouns: ['Day', 'Dance', 'World', 'Song'],
    backgrounds: ['rainbowrush', 'prismplayground', 'dreamdisco', 'skycarnival']
  }
};

const pick = (arr, i) => arr[i % arr.length];

const resolveTheme = (theme) => THEME_BANK[theme] || THEME_BANK.animals;

const buildTitle = (theme, idx = 0) => {
  const bank = resolveTheme(theme);
  return `${pick(bank.titleWords, idx)} ${pick(bank.nouns, idx + 1)}`;
};

const buildLyrics = (theme, profile) => {
  const a = profile.vocabulary.animals;
  const c = profile.vocabulary.colors;
  const chorus = [
    `${pick(a, 0)} ${pick(profile.vocabulary.actions, 0)}, ${pick(a, 0)} ${pick(profile.vocabulary.actions, 0)}!`,
    `${pick(c, 0)} and ${pick(c, 1)}, sing and ${pick(profile.vocabulary.actions, 4)}!`
  ];
  const verse = [
    `Little ${pick(a, 1)} goes ${pick(profile.vocabulary.actions, 1)} in the sun,`,
    `${pick(a, 2)} and ${pick(a, 3)} join the fun!`
  ];
  if (theme === 'vehicles') {
    return {
      chorus: ['Zoom, zoom, little car, go!', 'Chug, chug, little train, say hello!'],
      verse: ['Round the corner, wheels go fast,', 'Friendly horn and smiles that last!']
    };
  }
  return { chorus, verse };
};

export const generateStoryboard = ({
  theme = 'animals',
  age = '2-5',
  durationSec = 60,
  complexity = 'med',
  styleProfile = defaultStyleProfile
} = {}) => {
  const profile = { ...defaultStyleProfile, ...styleProfile };
  const lyrics = buildLyrics(theme, profile);
  const bank = resolveTheme(theme);
  const sceneDur = Math.max(2, Math.min(4, profile.scenePacingSec || 3));
  const sceneCount = Math.max(1, Math.floor(durationSec / sceneDur));

  const scenes = Array.from({ length: sceneCount }, (_, i) => {
    const isChorus = i % 4 < 2;
    const line = isChorus ? pick(lyrics.chorus, i) : pick(lyrics.verse, i);
    const charId = isChorus ? pick(['bunny', 'dog', 'cat', 'bird'], i) : pick(['car', 'train', 'dino', 'fish'], i);
    const action = pick(profile.vocabulary.actions, i);
    return {
      t: i * sceneDur,
      dur: sceneDur,
      bg: pick(bank.backgrounds, i),
      chars: [{ id: charId, x: 0.25 + (i % 3) * 0.2, y: 0.72, action }],
      caption: line
    };
  });

  return {
    title: buildTitle(theme, scenes.length),
    theme,
    targetAge: age,
    durationSec,
    complexity,
    bpm: profile.bpm,
    sections: [
      { type: 'chorus', lines: lyrics.chorus, repeat: profile.chorusRepeat },
      { type: 'verse', lines: lyrics.verse, repeat: 1 }
    ],
    scenes,
    sfx: ['clap', 'ding']
  };
};
