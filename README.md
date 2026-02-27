# Motion Project: Generative Kids Cartoon Canvas Engine

A browser-only animated graphics engine for kids age 2-5. It renders calming cartoon scenes in Canvas 2D with friendly characters, soft particles, and rotating themes (Underwater, Space, Candyland).

## Run locally

```bash
npm install
npm run dev
npm run build
```

Then open http://localhost:5173.

## How scenes work

- Every scene uses a seeded RNG (`mulberry32`) so each generated setup is unique but controlled.
- Scene manager rotates scenes every ~45 seconds.
- A hard reset occurs every ~6 minutes to clear/rebuild state and avoid long-term drift.
- `Next Scene` can force immediate switch.

## Long-running performance notes

- Character and particle counts are bounded by complexity presets.
- Each scene includes 20 additional characters for richer visuals while still keeping capped totals.
- Object counts are bounded by complexity presets (low/med/high).
- Particle allocation uses a fixed-size pool to avoid frequent garbage allocations.
- Frame delta time is clamped to 33ms in the RAF loop.
- FPS watchdog tracks SMA(10); if average FPS drops below 40, complexity is automatically reduced.
- Scene switches reset/reuse pools and state to prevent unbounded memory growth.
