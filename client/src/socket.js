import { io } from 'socket.io-client';

// 同源连接(开发由 vite 代理,生产由后端托管)
export const socket = io();

// 每个标签页一个持久 id,刷新可回到原座位
export function getPlayerId() {
  let id = sessionStorage.getItem('playerId');
  if (!id) {
    id = Math.random().toString(36).slice(2);
    sessionStorage.setItem('playerId', id);
  }
  return id;
}
