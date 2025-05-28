import { defineConfig } from 'vite';
// import tailwindcss from "tailwindcss";

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'TetherPay',
      fileName: 'tetherpay',
      formats: ['iife'],
    },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  // css: {
  //   postcss: {
  //     plugins: [tailwindcss()],
  //   },
  // },
});
