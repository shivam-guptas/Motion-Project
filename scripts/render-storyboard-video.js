import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { palettes } from '../src/utils/palette.js';

const root = process.cwd();
const outDir = path.join(root, 'output');
const storyboardPath = path.join(outDir, 'storyboard.json');
const tempDir = path.join(outDir, '.tmp-clips');

const ensureFfmpeg = () => {
  const probe = spawnSync('ffmpeg', ['-version'], { encoding: 'utf-8' });
  if (probe.status !== 0) throw new Error('ffmpeg not found in PATH.');
};

const run = (args) => {
  const res = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (res.status !== 0) throw new Error(`ffmpeg failed: ffmpeg ${args.join(' ')}`);
};

const resolveDuration = (storyboard) => {
  if (Number.isFinite(storyboard.durationSec) && storyboard.durationSec > 0) return storyboard.durationSec;
  return storyboard.scenes.reduce((max, s) => Math.max(max, (s.t || 0) + (s.dur || 0)), 0);
};

const main = () => {
  if (!fs.existsSync(storyboardPath)) {
    throw new Error(`Missing storyboard at ${storyboardPath}. Run "npm run generate:storyboard" first.`);
  }
  ensureFfmpeg();
  const storyboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf-8'));
  const scenes = [...(storyboard.scenes || [])].sort((a, b) => (a.t || 0) - (b.t || 0));
  if (!scenes.length) throw new Error('Storyboard has no scenes.');

  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const fps = 30;
  scenes.forEach((scene, i) => {
    const pal = palettes[(scene.bg || 'candyland').toLowerCase()] || palettes.candyland;
    const color = (pal.backgroundTop || '#333333').replace('#', '0x');
    const clipPath = path.join(tempDir, `scene-${String(i).padStart(3, '0')}.mp4`);
    const dur = Math.max(0.1, scene.dur || 0.1);
    run([
      '-y',
      '-f',
      'lavfi',
      '-i',
      `color=c=${color}:s=1280x720:r=${fps}:d=${dur}`,
      '-vf',
      'format=yuv420p',
      '-an',
      clipPath
    ]);
  });

  const concatFile = path.join(tempDir, 'concat.txt');
  const concatLines = scenes.map((_, i) => `file '${path.join(tempDir, `scene-${String(i).padStart(3, '0')}.mp4`).replace(/\\/g, '/')}'`);
  fs.writeFileSync(concatFile, `${concatLines.join('\n')}\n`, 'utf-8');

  const videoPath = path.join(outDir, 'video.mp4');
  run([
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    concatFile,
    '-c',
    'copy',
    videoPath
  ]);

  const totalSec = resolveDuration(storyboard).toFixed(2);
  console.log(`Storyboard video generated: ${videoPath} (${totalSec}s)`);
};

main();
