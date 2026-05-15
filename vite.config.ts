import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-leaflet') || id.includes('/leaflet/') || id.includes('leaflet/dist')) {
            return 'leaflet';
          }
          if (id.includes('@stripe')) return 'stripe';
          if (id.includes('i18next') || id.includes('react-i18next')) return 'i18n';
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'forms';
          }
          if (id.includes('react-router')) return 'router';
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('scheduler/')
          ) {
            return 'react';
          }
          return undefined;
        },
      },
    },
  },
});
