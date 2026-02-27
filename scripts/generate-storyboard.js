import fs from 'node:fs';
import path from 'node:path';
import { generateStoryboard } from '../src/mvp/storyboardGenerator.js';

const root = process.cwd();
const args = process.argv.slice(2);
const settingsPath = args[0] ? path.resolve(root, args[0]) : null;

let settings = {};
if (settingsPath && fs.existsSync(settingsPath)) {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
}

const storyboard = generateStoryboard(settings);
const outputDir = path.join(root, 'output');
const outputPath = path.join(outputDir, 'storyboard.json');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(storyboard, null, 2)}\n`, 'utf-8');

console.log(`Storyboard generated: ${outputPath}`);
