import { useEffect, useState } from 'react';

const GAMES = [
  { key: 'gomoku', emoji: '⚫', name: '五子棋', desc: '15×15 · 连五获胜' },
  { key: 'xiangqi', emoji: '♟️', name: '中国象棋', desc: '吃掉对方将帅获胜' },
  { key: 'tictactoe', emoji: '⭕', name: '井字棋', desc: '3×3 · 连三获胜' },
  { key: 'reversi', emoji: '🟢', name: '黑白棋', desc: '8×8 · 翻子比多' },
];

export default function Lobby({ autoCode, onCreate, onJoin }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (autoCode) setCode(autoCode);
  }, [autoCode]);

  return (
    <>
   <div className="games">
        {GAMES.map((g) => (
        <div key={g.key} className="game-card" onClick={() => onCreate(g.key)}>
   <div className="emoji">{g.emoji}</div>
            <div className="name">{g.name}</div>
        <div className="desc">{g.desc}</div>
          </div>
   ))}
      </div>
 <div className="join-box">
        <input
          value={code}
          maxLength={4}
   placeholder="房间码"
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <button onClick={() => code && onJoin(code)}>加入房间</button>
      </div>
    </>
  );
}
