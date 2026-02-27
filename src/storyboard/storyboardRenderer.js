function lerp(a, b, t) {
  return a + (b - a) * t;
}

function activeActions(layer, localTime) {
  return (layer.actions || []).filter((action) => localTime >= action.start && localTime <= action.end);
}

function applyActions(layer, localTime) {
  const base = {
    x: layer.transform?.x ?? 0.5,
    y: layer.transform?.y ?? 0.5,
    scale: layer.transform?.scale ?? 1,
    rotation: 0,
    alpha: 1,
    text: layer.value || ''
  };

  for (const action of activeActions(layer, localTime)) {
    const intensity = action.intensity ?? 0.5;
    const span = Math.max(0.001, action.end - action.start);
    const t = (localTime - action.start) / span;

    switch (action.name) {
      case 'bounce':
        base.y -= Math.abs(Math.sin(t * Math.PI * 4)) * 0.06 * intensity;
        break;
      case 'sway':
        base.rotation += Math.sin(t * Math.PI * 2) * 0.2 * intensity;
        break;
      case 'nod':
        base.rotation += Math.sin(t * Math.PI * 8) * 0.05 * intensity;
        break;
      case 'float':
        base.y += Math.sin(t * Math.PI * 4) * 0.04 * intensity;
        break;
      case 'spin':
        base.rotation += t * Math.PI * 2;
        break;
      case 'hop': {
        const parabolic = 4 * t * (1 - t);
        base.y -= parabolic * 0.12 * intensity;
        break;
      }
      case 'popIn':
        base.scale *= lerp(0, 1, Math.min(1, t));
        base.alpha *= Math.min(1, t * 1.3);
        break;
      case 'popOut':
        base.scale *= lerp(1, 0, Math.min(1, t));
        base.alpha *= 1 - Math.min(1, t);
        break;
      case 'typeOn': {
        const count = Math.floor((layer.value || '').length * Math.min(1, t));
        base.text = (layer.value || '').slice(0, count);
        break;
      }
      default:
        break;
    }
  }

  return base;
}

function findScene(storyboard, elapsed) {
  return storyboard.timeline.find(
    (scene) => elapsed >= scene.start && elapsed < scene.start + scene.duration
  );
}

function drawBackground(ctx, width, height, scene) {
  const isNight = scene.bg?.includes('night');
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, isNight ? '#3c467f' : '#9ee9ff');
  grad.addColorStop(1, isNight ? '#202238' : '#d8ffc7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

function sortLayers(layers) {
  return [...layers].sort((a, b) => (a.transform?.z || 0) - (b.transform?.z || 0));
}

function drawLayer(ctx, width, height, layer, state) {
  const x = state.x * width;
  const y = state.y * height;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(state.rotation);
  ctx.globalAlpha = state.alpha;

  if (layer.type === 'char') {
    const radius = 45 * state.scale;
    ctx.fillStyle = '#fff4d5';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff9ebc';
    ctx.beginPath();
    ctx.arc(-radius * 0.5, -radius * 0.7, radius * 0.35, 0, Math.PI * 2);
    ctx.arc(radius * 0.5, -radius * 0.7, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
  } else if (layer.type === 'prop') {
    const size = 34 * state.scale;
    ctx.fillStyle = '#ffe066';
    ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
  } else if (layer.type === 'text') {
    ctx.fillStyle = '#10253f';
    ctx.font = `${Math.max(22, 42 * state.scale)}px "Comic Sans MS", "Trebuchet MS", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(state.text, 0, 0);
  }

  ctx.restore();
}

export function renderStoryboardFrame(ctx, width, height, storyboard, elapsed) {
  const scene = findScene(storyboard, elapsed);
  if (!scene) return;

  drawBackground(ctx, width, height, scene);
  const localTime = elapsed - scene.start;
  const orderedLayers = sortLayers(scene.layers || []);
  for (const layer of orderedLayers) {
    const state = applyActions(layer, localTime);
    drawLayer(ctx, width, height, layer, state);
  }
}
