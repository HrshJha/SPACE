import { ellipsePoint } from '../utils/cosmicMath.js';

/**
 * Approximates the current orbital angle using orbital period.
 * @param {number} elapsedSeconds
 * @param {number} orbitalPeriodDays
 * @returns {number}
 */
export function orbitalAngle(elapsedSeconds, orbitalPeriodDays) {
  return (elapsedSeconds / (orbitalPeriodDays * 0.18)) % (Math.PI * 2);
}

/**
 * Returns a compressed position on an orbital ellipse.
 * @param {number} elapsedSeconds
 * @param {number} orbitalPeriodDays
 * @param {number} radius
 * @param {number} axialTiltDeg
 * @returns {[number, number, number]}
 */
export function orbitalPosition(
  elapsedSeconds,
  orbitalPeriodDays,
  radius,
  axialTiltDeg,
) {
  const point = ellipsePoint(
    orbitalAngle(elapsedSeconds, orbitalPeriodDays),
    radius,
    0.08,
  );

  return [point.x, Math.sin((axialTiltDeg * Math.PI) / 180) * 0.05, point.z];
}
