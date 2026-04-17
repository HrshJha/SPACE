import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-core';
          }

          if (id.includes('@react-three/fiber')) {
            return 'r3f-core';
          }

          if (id.includes('@react-three/drei')) {
            return 'drei-core';
          }

          if (id.includes('node_modules/gsap')) {
            return 'gsap-stack';
          }

          if (id.includes('node_modules/framer-motion') || id.includes('motion-dom')) {
            return 'motion-stack';
          }

          if (id.includes('node_modules/howler') || id.includes('node_modules/lenis')) {
            return 'immersive-stack';
          }

          return undefined;
        },
      },
    },
  },
});
