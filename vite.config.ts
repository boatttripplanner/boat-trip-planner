import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
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
        host: true,
        port: 5173
      },
      optimizeDeps: {
        include: ['react', 'react-dom', '@google/genai']
      }
    };
});
