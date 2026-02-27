export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
export const oscillate = (time, speed, amplitude, offset = 0) => Math.sin(time * speed + offset) * amplitude;
