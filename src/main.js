import { CanvasRenderer } from './render/canvasRenderer.js';
import { SceneManager } from './engine/sceneManager.js';
import { StoryboardPlayer } from './engine/storyboardPlayer.js';
import { RafLoop } from './engine/loop.js';

const loadStoryboard = async () => {
  const url = new URL(window.location.href);
  const storyboardPath = url.searchParams.get('storyboard') || '/output/storyboard.json';
  try {
    const res = await fetch(storyboardPath, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const init = async () => {
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
  `;
  app.appendChild(hud);

  const renderer = new CanvasRenderer(canvas);
  const storyboard = await loadStoryboard();
  const engine = storyboard
    ? new StoryboardPlayer(() => ({ width: renderer.width, height: renderer.height }), storyboard)
    : new SceneManager(() => ({ width: renderer.width, height: renderer.height }));

  const hudText = hud.querySelector('#hudText');
  const toggleBtn = hud.querySelector('#toggleBtn');
  const nextBtn = hud.querySelector('#nextBtn');
  const complexitySelect = hud.querySelector('#complexity');

  if (storyboard) complexitySelect.disabled = true;

  const loop = new RafLoop((dt, elapsed) => {
    engine.update(dt, elapsed);
    renderer.render(engine.scene, engine.particlePool, elapsed);
    const status = engine.getHud();
    hudText.innerHTML = `
      <strong>Theme:</strong> ${status.theme}<br>
      <strong>Objects:</strong> ${status.objectCount}<br>
      <strong>Particles:</strong> ${status.particleCount}<br>
      <strong>Avg FPS:</strong> ${status.avgFps}<br>
      <strong>Seed:</strong> ${status.seed}<br>
      <strong>Caption:</strong> ${status.caption || ''}
    `;
    complexitySelect.value = status.complexity;
  });

  window.addEventListener('resize', () => {
    renderer.resize();
    if (typeof engine.currentFactoryIndex === 'number') engine.switchScene(engine.currentFactoryIndex);
    else if (typeof engine.activeIndex === 'number') engine.switchScene(engine.activeIndex);
  });

  let running = true;
  toggleBtn.addEventListener('click', () => {
    running = !running;
    if (running) loop.start();
    else loop.stop();
    toggleBtn.textContent = running ? 'Pause' : 'Start';
  });

  nextBtn.addEventListener('click', () => engine.switchScene());
  complexitySelect.addEventListener('change', (event) => engine.setComplexity(event.target.value));

  loop.start();
};

init();
