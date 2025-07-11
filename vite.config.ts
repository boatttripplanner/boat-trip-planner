import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/boat-_trip-_planner/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['react-markdown', 'remark-gfm'],
          ai: ['@google/genai']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  },
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@google/genai']
  }
});
