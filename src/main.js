import { CanvasRenderer } from './render/canvasRenderer.js';
import { SceneManager } from './engine/sceneManager.js';
import { RafLoop } from './engine/loop.js';
import { sampleStoryboard } from './storyboard/sampleStoryboard.js';
import { assertValidStoryboard } from './storyboard/storyboardSchema.js';
import { renderStoryboardFrame } from './storyboard/storyboardRenderer.js';

const app = document.getElementById('app');
const canvas = document.createElement('canvas');
canvas.setAttribute('aria-label', 'Generative kids cartoon scene');
app.appendChild(canvas);

const hud = document.createElement('div');
hud.className = 'hud';
hud.innerHTML = `
  <div id="hudText"></div>
  <div class="controls">
    <button id="toggleBtn" aria-label="Start or pause animation">Pause</button>
    <button id="nextBtn" aria-label="Switch to next scene">Next Scene</button>
  </div>
  <label for="complexity">Complexity</label>
  <select id="complexity" aria-label="Complexity level">
    <option value="low">Low</option>
    <option value="med" selected>Med</option>
    <option value="high">High</option>
  </select>
  <label for="mode">Mode</label>
  <select id="mode" aria-label="Render mode">
    <option value="generative" selected>Generative</option>
    <option value="storyboard">Storyboard demo</option>
  </select>
`;
app.appendChild(hud);

const renderer = new CanvasRenderer(canvas);
const sceneManager = new SceneManager(() => ({ width: renderer.width, height: renderer.height }));

const hudText = hud.querySelector('#hudText');
const toggleBtn = hud.querySelector('#toggleBtn');
const nextBtn = hud.querySelector('#nextBtn');
const complexitySelect = hud.querySelector('#complexity');
const modeSelect = hud.querySelector('#mode');

let mode = 'generative';
assertValidStoryboard(sampleStoryboard);

const loop = new RafLoop((dt, elapsed) => {
  if (mode === 'storyboard') {
    const cycleTime = sampleStoryboard.meta.durationSec;
    renderStoryboardFrame(
      renderer.ctx,
      renderer.width,
      renderer.height,
      sampleStoryboard,
      elapsed % cycleTime
    );
  } else {
    sceneManager.update(dt, elapsed);
    renderer.render(sceneManager.scene, sceneManager.particlePool, elapsed);
  }

  const status = sceneManager.getHud();
  hudText.innerHTML = `
    <strong>Theme:</strong> ${mode === 'storyboard' ? sampleStoryboard.meta.title : status.theme}<br>
    <strong>Mode:</strong> ${mode}<br>
    <strong>Objects:</strong> ${status.objectCount}<br>
    <strong>Particles:</strong> ${status.particleCount}<br>
    <strong>Avg FPS:</strong> ${status.avgFps}<br>
    <strong>Seed:</strong> ${status.seed}
  `;
  complexitySelect.value = status.complexity;
});

window.addEventListener('resize', () => {
  renderer.resize();
  sceneManager.switchScene(sceneManager.currentFactoryIndex);
});

let running = true;
toggleBtn.addEventListener('click', () => {
  running = !running;
  if (running) loop.start();
  else loop.stop();
  toggleBtn.textContent = running ? 'Pause' : 'Start';
});

nextBtn.addEventListener('click', () => sceneManager.switchScene());
complexitySelect.addEventListener('change', (event) => sceneManager.setComplexity(event.target.value));
modeSelect.addEventListener('change', (event) => {
  mode = event.target.value;
});

loop.start();
