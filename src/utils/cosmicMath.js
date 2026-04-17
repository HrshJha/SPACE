import * as THREE from 'three';
import { spectralClasses } from './stellarData.js';

/**
 * Restrains a number to a fixed range.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Interpolates between two values.
 * @param {number} start
 * @param {number} end
 * @param {number} amount
 * @returns {number}
 */
export function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

/**
 * Returns an inverse-square decay value with a softened minimum radius.
 * @param {number} distance
 * @param {number} strength
 * @param {number} softening
 * @returns {number}
 */
export function inverseSquareFalloff(distance, strength = 1, softening = 24) {
  const safeDistance = Math.max(softening, distance);
  return strength / (safeDistance * safeDistance);
}

/**
 * Creates a deterministic pseudo-random number from a seed.
 * @param {number} seed
 * @returns {number}
 */
export function seededRandom(seed) {
  const raw = Math.sin(seed * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}

/**
 * Generates an orbital position on a compressed ellipse.
 * @param {number} angle
 * @param {number} radius
 * @param {number} eccentricity
 * @returns {THREE.Vector3}
 */
export function ellipsePoint(angle, radius, eccentricity = 0.08) {
  const semiMinor = radius * Math.sqrt(1 - eccentricity ** 2);
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * semiMinor,
  );
}

/**
 * Picks a star class using rough Hertzsprung-Russell probabilities.
 * @param {number} sample
 * @returns {{ key: string, color: string, label: string }}
 */
export function getSpectralClass(sample) {
  let threshold = 0;

  for (const starClass of spectralClasses) {
    threshold += starClass.probability;
    if (sample <= threshold) {
      return starClass;
    }
  }

  return spectralClasses[spectralClasses.length - 1];
}

/**
 * Generates typed star field buffers for GPU-friendly rendering.
 * @param {number} count
 * @returns {{
 * positions: Float32Array,
 * colors: Float32Array,
 * sizes: Float32Array,
 * phases: Float32Array
 * }}
 */
export function generateStarField(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const radius = 24 + seededRandom(index + 1) * 220;
    const theta = seededRandom(index * 2 + 7) * Math.PI * 2;
    const phi = Math.acos(2 * seededRandom(index * 3 + 11) - 1);
    const spectral = getSpectralClass(seededRandom(index * 5 + 17));
    const color = new THREE.Color(spectral.color);

    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi) * 0.5;
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
    sizes[index] =
      spectral.key === 'M'
        ? 1.4
        : 2.2 + seededRandom(index * 7 + 19) * 2.4;
    phases[index] = seededRandom(index * 11 + 23) * Math.PI * 2;
  }

  return { positions, colors, sizes, phases };
}

/**
 * Creates three nebula nodes used as attractors for gas motion.
 * @returns {Array<{ position: [number, number, number], intensity: number }>}
 */
export function generateNebulaNodes() {
  return [
    { position: [-18, 8, -30], intensity: 1.2 },
    { position: [26, -6, -44], intensity: 0.9 },
    { position: [4, 18, -22], intensity: 1.05 },
  ];
}

/**
 * Produces a normalized 2D direction approximating a curl-noise field.
 * This is a light approximation intended for UI fluidity, not CFD research.
 * @param {number} x
 * @param {number} y
 * @param {number} time
 * @returns {[number, number]}
 */
export function pseudoCurlNoise(x, y, time) {
  const angle =
    Math.sin(x * 0.7 + time * 0.12) +
    Math.cos(y * 0.5 - time * 0.08) +
    Math.sin((x + y) * 0.3 + time * 0.04);

  return [Math.cos(angle), Math.sin(angle)];
}

/**
 * Formats a metric value with unit label.
 * @param {number|string} value
 * @param {string} unit
 * @returns {string}
 */
export function metric(value, unit) {
  return `${value} ${unit}`.trim();
}
