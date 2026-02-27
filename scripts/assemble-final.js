import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const outDir = path.join(root, 'output');

const ensureFile = (p) => {
  if (!fs.existsSync(p)) throw new Error(`Missing required file: ${p}`);
};

const ensureFfmpeg = () => {
  const probe = spawnSync('ffmpeg', ['-version'], { encoding: 'utf-8' });
  if (probe.status !== 0) throw new Error('ffmpeg not found in PATH.');
};

const main = () => {
  const videoPath = path.join(outDir, 'video.mp4');
  const musicPath = path.join(outDir, 'music.wav');
  const voicePath = path.join(outDir, 'voice.wav');
  const captionsPath = path.join(outDir, 'captions.srt');
  const finalPath = path.join(outDir, 'final.mp4');

  ensureFfmpeg();
  ensureFile(videoPath);
  ensureFile(musicPath);
  ensureFile(voicePath);
  ensureFile(captionsPath);

  const subtitleFilterPath = 'output/captions.srt';
  const filterComplex = '[1:a]volume=0.75[music];[2:a]volume=1.15[voice];[music][voice]amix=inputs=2:duration=longest[aout]';
  const subtitleFilter = `subtitles=${subtitleFilterPath}:force_style='Fontsize=30,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=2,Shadow=0'`;

  const args = [
    '-y',
    '-i',
    videoPath,
    '-i',
    musicPath,
    '-i',
    voicePath,
    '-filter_complex',
    filterComplex,
    '-map',
    '0:v',
    '-map',
    '[aout]',
    '-vf',
    subtitleFilter,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-shortest',
    finalPath
  ];

  const res = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (res.status !== 0) throw new Error('ffmpeg assembly failed.');
  console.log(`Final MP4 generated: ${finalPath}`);
};

main();
