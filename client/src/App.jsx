import { useEffect, useState } from 'react';
import { socket, getPlayerId } from './socket';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';

export default function App() {
  const [room, setRoom] = useState(null); // { code, side, gameType }
  const [view, setView] = useState(null); // { gameState, currentTurn, result }
  const [count, setCount] = useState(0);
  const [err, setErr] = useState('');
  const [autoCode, setAutoCode] = useState('');

  useEffect(() => {
    const onEnter = (d) => {
      setRoom({ code: d.code, side: d.side, gameType: d.gameType });
      setView({ gameState: d.gameState, currentTurn: d.currentTurn, result: d.result });
    };
  socket.on('roomCreated', onEnter);
    socket.on('joined', onEnter);
    socket.on('state', setView);
    socket.on('presence', (d) => setCount(d.count));
    socket.on('errorMsg', (d) => {
      setErr(d.msg);
      setTimeout(() => setErr(''), 2000);
    });
    const code = new URLSearchParams(location.search).get('room');
    if (code) {
      const c = code.toUpperCase();
      setAutoCode(c); // 自动加入失败(房满/不存在)时回落到大厅预填
      socket.emit('joinRoom', { code: c, playerId: getPlayerId() });
    }
    return () => {
      socket.off('roomCreated', onEnter);
      socket.off('joined', onEnter);
      socket.off('state', setView);
   socket.off('presence');
      socket.off('errorMsg');
    };
  }, []);

  const actions = {
    create: (gameType) => socket.emit('createRoom', { gameType, playerId: getPlayerId() }),
    join: (code) => socket.emit('joinRoom', { code, playerId: getPlayerId() }),
    move: (m) => socket.emit('move', m),
    undo: () => socket.emit('undo'),
    resign: () => socket.emit('resign'),
    rematch: () => socket.emit('rematch'),
    leave: () => {
      window.location = location.pathname;
    },
  };

  return (
    <div className="app">
      <div className="title">
        一起<span>玩</span>
  </div>
      {room ? (
    <GameRoom room={room} view={view} count={count} actions={actions} />
      ) : (
        <Lobby autoCode={autoCode} onCreate={actions.create} onJoin={actions.join} />
      )}
      {err && <div className="toast">{err}</div>}
    </div>
  );
}
