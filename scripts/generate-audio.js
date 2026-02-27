import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const storyboardPath = path.join(root, 'output', 'storyboard.json');
const outDir = path.join(root, 'output');

const SAMPLE_RATE = 44100;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const getStoryboard = () => {
  if (!fs.existsSync(storyboardPath)) {
    throw new Error(`Missing storyboard: ${storyboardPath}. Run "npm run generate:storyboard" first.`);
  }
  return JSON.parse(fs.readFileSync(storyboardPath, 'utf-8'));
};

const getDuration = (storyboard) => {
  if (Number.isFinite(storyboard.durationSec) && storyboard.durationSec > 0) return storyboard.durationSec;
  return storyboard.scenes.reduce((max, s) => Math.max(max, (s.t || 0) + (s.dur || 0)), 0);
};

const secondsToSrt = (sec) => {
  const totalMs = Math.max(0, Math.floor(sec * 1000));
  const ms = totalMs % 1000;
  const totalSec = Math.floor(totalMs / 1000);
  const s = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const m = totalMin % 60;
  const h = Math.floor(totalMin / 60);
  const pad = (n, width = 2) => `${n}`.padStart(width, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
};

const writeSrt = (storyboard) => {
  const lines = [];
  const scenes = [...(storyboard.scenes || [])].sort((a, b) => (a.t || 0) - (b.t || 0));
  scenes.forEach((scene, i) => {
    const start = scene.t || 0;
    const end = start + (scene.dur || 0);
    lines.push(`${i + 1}`);
    lines.push(`${secondsToSrt(start)} --> ${secondsToSrt(end)}`);
    lines.push(scene.caption || '');
    lines.push('');
  });
  fs.writeFileSync(path.join(outDir, 'captions.srt'), `${lines.join('\n')}\n`, 'utf-8');
};

const floatTo16BitPcm = (sample) => {
  const s = clamp(sample, -1, 1);
  return s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff);
};

const writeWav = (filePath, samples, sampleRate = SAMPLE_RATE) => {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i += 1) {
    buffer.writeInt16LE(floatTo16BitPcm(samples[i]), 44 + i * 2);
  }
  fs.writeFileSync(filePath, buffer);
};

const envelope = (t, attack, release, dur) => {
  if (t < 0 || t > dur) return 0;
  if (t < attack) return t / attack;
  if (t > dur - release) return (dur - t) / release;
  return 1;
};

const generateMusic = (storyboard, durationSec) => {
  const total = Math.floor(durationSec * SAMPLE_RATE);
  const bpm = storyboard.bpm || 105;
  const beatSec = 60 / bpm;
  const samples = new Float32Array(total);
  const baseFreq = 220;
  const chord = [1, 1.25, 1.5];

  for (let i = 0; i < total; i += 1) {
    const t = i / SAMPLE_RATE;
    let v = 0;
    const beatPos = t % beatSec;
    if (beatPos < 0.09) v += Math.sin(2 * Math.PI * 880 * t) * envelope(beatPos, 0.01, 0.07, 0.09) * 0.12;
    const measurePos = t % (beatSec * 4);
    if (measurePos < 0.6) {
      for (let c = 0; c < chord.length; c += 1) {
        v += Math.sin(2 * Math.PI * baseFreq * chord[c] * t) * 0.045;
      }
      v *= envelope(measurePos, 0.04, 0.2, 0.6);
    }
    samples[i] = v;
  }
  return samples;
};

const generateVoiceTrack = (storyboard, durationSec) => {
  const total = Math.floor(durationSec * SAMPLE_RATE);
  const samples = new Float32Array(total);
  const cues = [];
  for (const scene of storyboard.scenes || []) {
    const words = (scene.caption || '').split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    const start = scene.t || 0;
    const dur = scene.dur || 0;
    const slice = dur / words.length;
    words.forEach((word, idx) => {
      const wordStart = start + idx * slice;
      const wordDur = Math.min(0.28, Math.max(0.12, slice * 0.7));
      cues.push({ t: wordStart, word, dur: wordDur });
      const f0 = 240 + (idx % 5) * 30;
      const startIndex = Math.floor(wordStart * SAMPLE_RATE);
      const endIndex = Math.min(total, Math.floor((wordStart + wordDur) * SAMPLE_RATE));
      for (let i = startIndex; i < endIndex; i += 1) {
        const t = i / SAMPLE_RATE - wordStart;
        const env = envelope(t, 0.02, 0.05, wordDur);
        samples[i] += Math.sin(2 * Math.PI * f0 * t) * env * 0.16;
      }
    });
  }
  fs.writeFileSync(path.join(outDir, 'chant_timing.json'), `${JSON.stringify(cues, null, 2)}\n`, 'utf-8');
  return samples;
};

const main = () => {
  fs.mkdirSync(outDir, { recursive: true });
  const storyboard = getStoryboard();
  const durationSec = Math.max(1, getDuration(storyboard));
  writeSrt(storyboard);
  const music = generateMusic(storyboard, durationSec);
  const voice = generateVoiceTrack(storyboard, durationSec);
  writeWav(path.join(outDir, 'music.wav'), music);
  writeWav(path.join(outDir, 'voice.wav'), voice);
  console.log(`Audio placeholders generated in ${outDir}`);
};

main();
