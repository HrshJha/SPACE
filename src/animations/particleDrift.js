import { inverseSquareFalloff, pseudoCurlNoise } from '../utils/cosmicMath.js';

/**
 * Computes a particle drift vector influenced by a cursor-like mass.
 * @param {{ x: number, y: number }} point
 * @param {{ x: number, y: number, mass: number }} attractor
 * @param {number} time
 * @returns {{ x: number, y: number }}
 */
export function computeParticleDrift(point, attractor, time) {
  const dx = attractor.x - point.x;
  const dy = attractor.y - point.y;
  const distance = Math.hypot(dx, dy);
  const gravity = inverseSquareFalloff(distance * 100, attractor.mass * 60, 40);
  const [curlX, curlY] = pseudoCurlNoise(point.x * 8, point.y * 8, time);

  return {
    x: dx * gravity + curlX * 0.004,
    y: dy * gravity + curlY * 0.004,
  };
}
