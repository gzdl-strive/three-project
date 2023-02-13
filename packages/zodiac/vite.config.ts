import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  clearScreen: false,
  server: {
    port: 8889,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      }
    }
  }
});