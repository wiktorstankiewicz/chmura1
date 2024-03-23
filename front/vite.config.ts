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
        target: 'http://back:80/socket.io/',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
