/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      include: [
        'src/components/**',
        'src/hooks/**',
        'src/stores/**',
        'src/lib/**',
        'src/api/**',
      ],
      exclude: ['**/*.d.ts', 'src/test/**', 'src/**/index.ts'],
      thresholds: {
        lines: 30,
        statements: 30,
        functions: 30,
        branches: 20,
      },
    },
  },
});
