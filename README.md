# Motion Project: Generative Kids Cartoon Canvas Engine

A browser-only animated graphics engine for kids age 2-5. It renders calming cartoon scenes in Canvas 2D with friendly characters, soft particles, and rotating themes (Underwater, Space, Candyland).

## Run locally

```bash
npm install
npm run dev
npm run build
```

Then open http://localhost:5173.

## MVP pipeline scaffold

Generate a storyboard JSON from settings:

```bash
npm run generate:storyboard -- mvp/settings.sample.json
```

Output:

- `output/storyboard.json`

Current MVP coverage:

- Default `style_profile` (no training required)
- Original rhyme + section structure generation
- Time-aligned scene list with actions + captions
- Theme/age/duration/complexity inputs

## Audio + MP4 pipeline

Prerequisite: install `ffmpeg` and make sure it is available in your PATH.

Generate placeholder audio + captions:

```bash
npm run generate:audio
```

This creates:

- `output/music.wav` (instrumental placeholder)
- `output/voice.wav` (chant timing placeholder)
- `output/captions.srt`
- `output/chant_timing.json`

Render storyboard video track (scene-timed color clips):

```bash
npm run render:video
```

Assemble final video with mixed audio and burned captions:

```bash
npm run assemble:mp4
```

Final output:

- `output/final.mp4`

## Storyboard playback in runtime

When `output/storyboard.json` exists, the browser runtime auto-loads it and plays scenes/actions by storyboard timeline.

- Default path: `/output/storyboard.json`
- Override path with query param: `?storyboard=/path/to/storyboard.json`

## How scenes work

- Every scene uses a seeded RNG (`mulberry32`) so each generated setup is unique but controlled.
- Scene manager rotates scenes every ~45 seconds.
- A hard reset occurs every ~6 minutes to clear/rebuild state and avoid long-term drift.
- `Next Scene` can force immediate switch.

## Long-running performance notes

- Object counts are bounded by complexity presets (low/med/high).
- Particle allocation uses a fixed-size pool to avoid frequent garbage allocations.
- Frame delta time is clamped to 33ms in the RAF loop.
- FPS watchdog tracks SMA(10); if average FPS drops below 40, complexity is automatically reduced.
- Scene switches reset/reuse pools and state to prevent unbounded memory growth.


npm run generate:storyboard -- mvp/settings.sample.json
npm run generate:audio
npm run render:video
npm run assemble:mp4
