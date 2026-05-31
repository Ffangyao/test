import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 开发时把 websocket 代理到后端,生产由后端直接托管,故同源无跨域
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
    '/socket.io': { target: 'http://localhost:3001', ws: true },
    },
  },
});
