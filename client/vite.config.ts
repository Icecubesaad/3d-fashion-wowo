import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Locally, proxy /api to the Express backend on :5000.
    // (In prod `vite preview` serves static files and the client uses
    // VITE_API_BASE directly, so this proxy is dev-only.)
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    // Railway may run the dev server instead of preview; allow its host either way.
    allowedHosts: true,
  },
  preview: {
    // Railway serves the built bundle via `vite preview`, which blocks any
    // Host header not explicitly allowed. Allow all — the URL is generated
    // by the platform and can change.
    allowedHosts: true,
  },
})
