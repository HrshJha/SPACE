import { cosmicPalette, sectionAuras } from '../constants/cosmicPalette.js';

export const paletteCssVars = Object.entries(cosmicPalette).reduce(
  (vars, [key, value]) => ({
    ...vars,
    [`--color-${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`]:
      value,
  }),
  {},
);

/**
 * Returns the accent color for the current section.
 * @param {string} section
 * @returns {string}
 */
export function getSectionAura(section) {
  return sectionAuras[section] ?? cosmicPalette.nebulaBlue;
}

/**
 * Blends two hex colors by a normalized amount.
 * @param {string} start
 * @param {string} end
 * @param {number} amount
 * @returns {string}
 */
export function mixHex(start, end, amount) {
  const safeAmount = Math.max(0, Math.min(1, amount));
  const parse = (value) => value.match(/\w\w/g)?.map((part) => Number.parseInt(part, 16)) ?? [0, 0, 0];
  const [r1, g1, b1] = parse(start.replace('#', ''));
  const [r2, g2, b2] = parse(end.replace('#', ''));
  const channel = (from, to) =>
    Math.round(from + (to - from) * safeAmount)
      .toString(16)
      .padStart(2, '0');

  return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`;
}
