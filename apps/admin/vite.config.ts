import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@gatelite/api-client': './node_modules/@gatelite/api-client/dist/index.js',
      '@gatelite/design-tokens': '../../packages/design-tokens/dist',
    },
  },
  optimizeDeps: {
    include: ['@gatelite/api-client', '@gatelite/design-tokens'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});