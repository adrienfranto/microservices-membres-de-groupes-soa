import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // mandray connection rehetra avy amin'ny réseau
    port: 5173,       // azonao ovaina raha tianao
  },
})
