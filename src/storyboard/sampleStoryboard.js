export const sampleStoryboard = {
  version: '1.0',
  meta: {
    title: 'Bouncy Bunny Day',
    theme: 'animals',
    ageBand: '2-3',
    durationSec: 12,
    complexity: 'med',
    bpm: 105,
    language: 'en-US'
  },
  timeline: [
    {
      id: 'scene_001',
      start: 0,
      duration: 4,
      bg: 'bg_park_day_v1',
      layers: [
        { type: 'bg', transform: { z: 0 } },
        {
          type: 'char',
          ref: 'bunny',
          transform: { x: 0.25, y: 0.75, scale: 1, z: 2 },
          actions: [{ name: 'bounce', start: 0, end: 4, intensity: 0.7 }]
        },
        {
          type: 'text',
          value: 'Bounce, bounce, bunny, bounce!',
          transform: { x: 0.5, y: 0.12, scale: 1, z: 10 },
          actions: [{ name: 'popIn', start: 0, end: 0.4 }]
        }
      ]
    },
    {
      id: 'scene_002',
      start: 4,
      duration: 4,
      bg: 'bg_park_day_v1',
      layers: [
        {
          type: 'char',
          ref: 'bunny',
          transform: { x: 0.5, y: 0.76, scale: 1, z: 2 },
          actions: [
            { name: 'sway', start: 0, end: 4, intensity: 0.8 },
            { name: 'nod', start: 0, end: 4, intensity: 0.5 }
          ]
        },
        {
          type: 'prop',
          ref: 'prop_star_v1',
          transform: { x: 0.72, y: 0.3, scale: 0.8, z: 4 },
          actions: [{ name: 'float', start: 0, end: 4, intensity: 0.6 }]
        },
        {
          type: 'text',
          value: 'Clap, clap, paws in the air!',
          transform: { x: 0.5, y: 0.12, scale: 1, z: 10 },
          actions: [{ name: 'typeOn', start: 0, end: 1.8 }]
        }
      ]
    },
    {
      id: 'scene_003',
      start: 8,
      duration: 4,
      bg: 'bg_bedroom_night_v1',
      layers: [
        {
          type: 'char',
          ref: 'bunny',
          transform: { x: 0.5, y: 0.76, scale: 1, z: 2 },
          actions: [{ name: 'hop', start: 0, end: 4, intensity: 0.7 }]
        },
        {
          type: 'text',
          value: 'Hop, hop, bunny says goodnight!',
          transform: { x: 0.5, y: 0.12, scale: 1, z: 10 },
          actions: [{ name: 'popIn', start: 0, end: 0.3 }]
        }
      ]
    }
  ],
  captions: [
    { start: 0, end: 4, text: 'Bounce, bounce, bunny, bounce!' },
    { start: 4, end: 8, text: 'Clap, clap, paws in the air!' },
    { start: 8, end: 12, text: 'Hop, hop, bunny says goodnight!' }
  ]
};
