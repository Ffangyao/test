const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const rooms = require('./rooms');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 生产环境托管打包后的前端
const dist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(dist));
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));

function presence(code) {
  const count = io.sockets.adapter.rooms.get(code)?.size || 0;
  io.to(code).emit('presence', { count });
}

function result(room) {
  return room.over || room.game.checkResult(room.state);
}

function snapshot(room) {
  return {
    gameType: room.gameType,
    gameState: room.state,
    currentTurn: room.state.turn,
    result: result(room),
  };
}

function broadcastState(room) {
  io.to(room.code).emit('state', snapshot(room));
}

io.on('connection', (socket) => {
  let current = null; // { code, side }

  function enter(room, side) {
    current = { code: room.code, side };
    socket.join(room.code);
  }

  socket.on('createRoom', ({ gameType, playerId }) => {
    const room = rooms.createRoom(gameType);
    if (!room) return socket.emit('errorMsg', { msg: '未知游戏' });
    const { side } = rooms.joinRoom(room.code, playerId);
    enter(room, side);
    socket.emit('roomCreated', { code: room.code, side, ...snapshot(room) });
    presence(room.code);
  });

  socket.on('joinRoom', ({ code, playerId }) => {
    const res = rooms.joinRoom((code || '').toUpperCase(), playerId);
    if (res.error) return socket.emit('errorMsg', { msg: res.error });
    enter(res.room, res.side);
    socket.emit('joined', { code: res.room.code, side: res.side, ...snapshot(res.room) });
    presence(res.room.code);
  });

  socket.on('move', (move) => {
    if (!current) return;
    const room = rooms.getRoom(current.code);
    if (!room || result(room)) return;
    if (!room.game.validateMove(room.state, move, current.side)) {
   return socket.emit('errorMsg', { msg: '非法走子' });
    }
  room.history.push(room.state);
    room.state = room.game.applyMove(room.state, move);
    broadcastState(room);
  });

  socket.on('undo', () => {
    if (!current) return;
    const room = rooms.getRoom(current.code);
    if (!room || !room.history.length) return;
    room.state = room.history.pop();
    room.over = null; // 悔棋可撤销刚结束的局面
    broadcastState(room);
  });

  socket.on('resign', () => {
    if (!current) return;
    const room = rooms.getRoom(current.code);
    if (!room || result(room)) return;
    room.over = { winner: current.side ^ 1 };
    broadcastState(room);
  });

  socket.on('rematch', () => {
    if (!current) return;
    const room = rooms.getRoom(current.code);
  if (!room) return;
 rooms.rematch(room);
    broadcastState(room);
  });

  socket.on('disconnect', () => {
    if (current) presence(current.code);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server listening on :${PORT}`));
