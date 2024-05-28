import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  clearScreen: false,
  server: {
    port: 8888,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
      /**
       * 手动处理模块chunks的函数。
       * 主要用于根据模块id来分割出特定的chunk名称。
       * 特别是对于那些包含 'node_modules' 字符串的id，此函数会将其处理并返回一个基于该模块路径的chunk名称。
       * @param {string} id - 模块的唯一标识符。
       * @returns {string} 返回根据模块id处理后的chunk名称。
       */
      manualChunks(id) {
        // 当模块id包含 'node_modules' 时进行处理
        if (id.includes('node_modules')) {
          // 通过分割字符串来提取chunk名称
          return id.toString().split('node_modules/')[1].split('/')[0].toString();
        }
      }
    }
  }
});