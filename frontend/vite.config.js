import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The browser calls same-origin "/api/..."; Vite proxies it to the backend.
// Local dev -> localhost:4000. In Docker compose -> http://backend:4000 (set via env).
const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': proxyTarget,
    },
  },
});
