import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Load .env so VITE_* vars are available here at config time.
// In prod, Railway injects VITE_API_BASE; we forward it to the client
// build (import.meta.env.VITE_API_BASE) so /api calls hit the real backend.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE || ''

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Expose the backend base to the client bundle.
    define: {
      'import.meta.env.VITE_API_BASE': JSON.stringify(apiBase),
    },
    server: {
      proxy: {
        // Forward API calls to the Express server (Module 1 backend).
        // changeOrigin + same origin lets the httpOnly auth cookie flow work.
        "/api": {
          target: apiBase || "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
    preview: {
      // Railway serves the built bundle via `vite preview`; it blocks any
      // Host header not on this list. Allow the Railway-generated URL.
      allowedHosts: [
        "client-production-f89f.up.railway.app",
        // keep localhost working for local `vite preview`
        "localhost",
        "127.0.0.1",
      ],
    },
  }
})
