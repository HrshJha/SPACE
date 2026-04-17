import { cosmicPalette } from './src/constants/cosmicPalette.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: cosmicPalette.voidBlack,
        deep: cosmicPalette.deepSpace,
        nebula: cosmicPalette.nebulaDark,
        horizon: cosmicPalette.horizon,
        stellar: cosmicPalette.stellarSurface,
        pulsar: cosmicPalette.pulsar,
        'nebula-blue': cosmicPalette.nebulaBlue,
        quantum: cosmicPalette.quantumPurple,
        plasma: cosmicPalette.plasmaOrange,
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        editorial: ['Syne', 'sans-serif'],
      },
      boxShadow: {
        aura: '0 0 40px rgba(74, 158, 255, 0.22)',
        plasma: '0 0 35px rgba(255, 107, 53, 0.28)',
      },
      backgroundImage: {
        cosmos:
          'radial-gradient(circle at top, rgba(74, 158, 255, 0.18), transparent 30%), radial-gradient(circle at 80% 10%, rgba(123, 79, 255, 0.18), transparent 28%), linear-gradient(180deg, #000000 0%, #020209 46%, #060618 100%)',
      },
      animation: {
        'scanline-slow': 'scanline 8s linear infinite',
        pulsehalo: 'pulsehalo 4s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%, 100%': { transform: 'translateY(-10%)' },
          '50%': { transform: 'translateY(110%)' },
        },
        pulsehalo: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.55',
          },
          '50%': {
            transform: 'scale(1.08)',
            opacity: '0.85',
          },
        },
      },
    },
  },
  plugins: [],
};
