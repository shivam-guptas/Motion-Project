const ALLOWED_ACTIONS = new Set([
  'idle',
  'bounce',
  'sway',
  'wave',
  'walkLeft',
  'walkRight',
  'hop',
  'blink',
  'nod',
  'wiggle',
  'float',
  'spin',
  'popIn',
  'popOut',
  'typeOn'
]);

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function pushError(errors, path, message) {
  errors.push({ path, message });
}

function validateActions(actions, path, errors) {
  if (!Array.isArray(actions)) {
    pushError(errors, path, 'actions must be an array');
    return;
  }

  actions.forEach((action, index) => {
    const actionPath = `${path}[${index}]`;
    if (typeof action !== 'object' || action === null) {
      pushError(errors, actionPath, 'action must be an object');
      return;
    }

    if (!ALLOWED_ACTIONS.has(action.name)) {
      pushError(errors, `${actionPath}.name`, `unsupported action: ${action.name}`);
    }

    if (!isNumber(action.start) || !isNumber(action.end) || action.end < action.start) {
      pushError(errors, actionPath, 'start/end must be numbers where end >= start');
    }

    if (action.intensity != null && (!isNumber(action.intensity) || action.intensity < 0 || action.intensity > 1)) {
      pushError(errors, `${actionPath}.intensity`, 'intensity must be between 0 and 1');
    }
  });
}

export function validateStoryboard(storyboard) {
  const errors = [];

  if (!storyboard || typeof storyboard !== 'object') {
    return { valid: false, errors: [{ path: 'root', message: 'storyboard must be an object' }] };
  }

  if (storyboard.version !== '1.0') {
    pushError(errors, 'version', 'version must be "1.0"');
  }

  const meta = storyboard.meta || {};
  if (!isNumber(meta.durationSec) || meta.durationSec <= 0) {
    pushError(errors, 'meta.durationSec', 'durationSec must be a positive number');
  }

  if (!Array.isArray(storyboard.timeline) || storyboard.timeline.length === 0) {
    pushError(errors, 'timeline', 'timeline must be a non-empty array');
  }

  const timeline = Array.isArray(storyboard.timeline) ? storyboard.timeline : [];
  timeline.forEach((scene, sceneIndex) => {
    const scenePath = `timeline[${sceneIndex}]`;
    if (!isNumber(scene.start) || !isNumber(scene.duration) || scene.duration <= 0) {
      pushError(errors, scenePath, 'scene start/duration must be valid positive numbers');
    }

    if (!Array.isArray(scene.layers)) {
      pushError(errors, `${scenePath}.layers`, 'layers must be an array');
      return;
    }

    scene.layers.forEach((layer, layerIndex) => {
      const layerPath = `${scenePath}.layers[${layerIndex}]`;
      if (!layer || typeof layer !== 'object') {
        pushError(errors, layerPath, 'layer must be an object');
        return;
      }

      if (!['bg', 'char', 'prop', 'text'].includes(layer.type)) {
        pushError(errors, `${layerPath}.type`, `unsupported layer type: ${layer.type}`);
      }

      if (layer.transform) {
        const { x, y } = layer.transform;
        if (x != null && (!isNumber(x) || x < 0 || x > 1)) pushError(errors, `${layerPath}.transform.x`, 'x must be in [0..1]');
        if (y != null && (!isNumber(y) || y < 0 || y > 1)) pushError(errors, `${layerPath}.transform.y`, 'y must be in [0..1]');
      }

      if (layer.actions) validateActions(layer.actions, `${layerPath}.actions`, errors);
    });
  });

  const totalDuration = timeline.reduce((maxEnd, scene) => {
    const end = (scene.start || 0) + (scene.duration || 0);
    return Math.max(maxEnd, end);
  }, 0);

  if (isNumber(meta.durationSec) && Math.abs(totalDuration - meta.durationSec) > 0.5) {
    pushError(errors, 'timeline', `timeline duration ${totalDuration.toFixed(2)}s does not match meta.durationSec ${meta.durationSec}s`);
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidStoryboard(storyboard) {
  const result = validateStoryboard(storyboard);
  if (!result.valid) {
    const details = result.errors.map((error) => `${error.path}: ${error.message}`).join('\n');
    throw new Error(`Storyboard validation failed:\n${details}`);
  }
}

export { ALLOWED_ACTIONS };
