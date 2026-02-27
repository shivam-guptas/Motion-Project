import { spawnSync } from 'node:child_process';

const fps = Number(process.env.FPS || 30);
const frames = process.env.FRAMES_PATTERN || 'output/jobs/demo/video/frames/frame_%06d.png';
const videoNoAudio = process.env.VIDEO_NO_AUDIO || 'output/jobs/demo/video/video_no_audio.mp4';
const mix = process.env.MIX_WAV || 'output/jobs/demo/audio/mix.wav';
const finalMp4 = process.env.FINAL_MP4 || 'output/jobs/demo/final.mp4';

const firstPass = spawnSync(
  'ffmpeg',
  ['-y', '-framerate', String(fps), '-i', frames, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', videoNoAudio],
  { stdio: 'inherit' }
);

if (firstPass.status !== 0) process.exit(firstPass.status || 1);

const secondPass = spawnSync(
  'ffmpeg',
  ['-y', '-i', videoNoAudio, '-i', mix, '-c:v', 'copy', '-c:a', 'aac', '-shortest', finalMp4],
  { stdio: 'inherit' }
);

process.exit(secondPass.status || 0);
