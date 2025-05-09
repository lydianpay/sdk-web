import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'TetherPay',
      fileName: 'tetherpay',
      formats: ['iife'],
    },
  },
});
