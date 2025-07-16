import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 8080,
    strictPort: true,
    cors: {
      origin: 'http://127.0.0.1:9090',
      credentials: true
    }
  }
})
