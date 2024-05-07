import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 5000,
    strictPort: true,
    host:'0.0.0.0',
    cors: true,
    proxy: {
      '/ws/': {
        target: 'http://back:3000/socket.io/',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  },
  server: {
    port: 5000,
    strictPort: true,
    host:'0.0.0.0',
    cors: true,
    proxy: {
      '/ws/': {
        target: 'http://localhost:3000/socket.io/',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    global: {},
  },
})
