import './styles.css';
import { CanvasRenderer } from './render/canvasRenderer.js';
import { SceneManager } from './engine/sceneManager.js';
import { RafLoop } from './engine/loop.js';

const COMPLEXITY_KEYS = ['low', 'med', 'high'];

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
  <label for="complexity">Complexity: <span id="complexityLabel">Med</span></label>
  <input id="complexity" aria-label="Complexity level" type="range" min="0" max="2" step="1" value="1" />
`;
app.appendChild(hud);

const renderer = new CanvasRenderer(canvas);
const sceneManager = new SceneManager(() => ({ width: renderer.width, height: renderer.height }));

const hudText = hud.querySelector('#hudText');
const toggleBtn = hud.querySelector('#toggleBtn');
const nextBtn = hud.querySelector('#nextBtn');
const complexitySlider = hud.querySelector('#complexity');
const complexityLabel = hud.querySelector('#complexityLabel');

const loop = new RafLoop((dt, elapsed) => {
  sceneManager.update(dt, elapsed);
  renderer.render(sceneManager.scene, sceneManager.particlePool, elapsed);
  const status = sceneManager.getHud();
  hudText.innerHTML = `
    <strong>Theme:</strong> ${status.theme} (${status.sceneIndex}/${status.sceneTotal})<br>
    <strong>Objects:</strong> ${status.objectCount}<br>
    <strong>Particles:</strong> ${status.particleCount}<br>
    <strong>Avg FPS:</strong> ${status.avgFps}<br>
    <strong>Seed:</strong> ${status.seed}
  `;
  const levelIndex = COMPLEXITY_KEYS.indexOf(status.complexity);
  complexitySlider.value = String(Math.max(levelIndex, 0));
  complexityLabel.textContent = status.complexity[0].toUpperCase() + status.complexity.slice(1);
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

toggleBtn.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') toggleBtn.click();
});
nextBtn.addEventListener('click', () => sceneManager.switchScene());
complexitySlider.addEventListener('input', (event) => {
  sceneManager.setComplexity(COMPLEXITY_KEYS[Number(event.target.value)]);
});

loop.start();
