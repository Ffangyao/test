// 房间管理:内存存储,code -> room。room.players[side] = playerId(持久 id,支持刷新重连)
const { customAlphabet } = require('nanoid');
const games = require('./games');

const code4 = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 4);
const rooms = new Map();

function createRoom(gameType) {
  if (!games[gameType]) return null;
  let code;
  do {
    code = code4();
  } while (rooms.has(code));
  const game = games[gameType];
  const room = { code, gameType, game, state: game.createInitialState(), players: [null, null], history: [], over: null };
  rooms.set(code, room);
  return room;
}

function getRoom(code) {
  return rooms.get(code);
}

// 加入房间:已在座则返回原座位(重连),否则占用空位
function joinRoom(code, playerId) {
  const room = rooms.get(code);
  if (!room) return { error: '房间不存在' };
  let side = room.players.indexOf(playerId);
  if (side === -1) {
    side = room.players.indexOf(null);
    if (side === -1) return { error: '房间已满' };
    room.players[side] = playerId;
  }
  return { room, side };
}

function rematch(room) {
  room.state = room.game.createInitialState();
  room.history = [];
  room.over = null;
}

module.exports = { createRoom, getRoom, joinRoom, rematch };
