// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(), // enables React Fast Refresh and TSX support
  ],
  server: {
    // ① Any request starting with '/api' will be forwarded to 'http://localhost:8000'
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',   // Django REST backend
        changeOrigin: true,                // see note below
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        secure: false,                     // allow self-signed certs if using https on backend
      },
    },
  },
})
