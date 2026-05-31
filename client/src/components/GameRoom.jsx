import ConnectBoard from './boards/ConnectBoard';
import ReversiBoard from './boards/ReversiBoard';
import XiangqiBoard from './boards/XiangqiBoard';

const NAMES = { gomoku: '五子棋', tictactoe: '井字棋', reversi: '黑白棋', xiangqi: '中国象棋' };

export default function GameRoom({ room, view, count, actions }) {
  if (!view) return null;
  const { gameType, side, code } = room;
  const { gameState, currentTurn, result } = view;
  const ready = count >= 2;
  const myTurn = ready && !result && currentTurn === side;

  let status;
  let dot = '#8b93b0';
  if (!ready) {
    status = '等待对手加入…';
    dot = '#ffb454';
  } else if (result?.draw) {
    status = '平局';
  } else if (result && result.winner !== undefined) {
    status = result.winner === side ? '🎉 你赢了!' : '对方赢了';
    dot = result.winner === side ? '#4ade80' : '#c0392b';
  } else {
status = myTurn ? '轮到你走' : '等待对方走子…';
    dot = myTurn ? '#4ade80' : '#8b93b0';
  }

  const link = `${location.origin}${location.pathname}?room=${code}`;
  const Board = { gomoku: ConnectBoard, tictactoe: ConnectBoard, reversi: ReversiBoard, xiangqi: XiangqiBoard }[gameType];

  return (
    <>
      <div className="bar">
 <div className="code-pill">
          {NAMES[gameType]} · 房间 <b>{code}</b>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!ready && (
 <button className="ghost" onClick={() => navigator.clipboard?.writeText(link)}>
     复制邀请链接
   </button>
  )}
 {ready && !result && (
            <>
           <button className="ghost" onClick={actions.undo}>悔棋</button>
           <button className="ghost" onClick={actions.resign}>投降</button>
        </>
          )}
          {result && <button onClick={actions.rematch}>再来一局</button>}
     <button className="ghost" onClick={actions.leave}>
      离开
  </button>
        </div>
      </div>
      <div className="status">
        <span className="dot" style={{ background: dot }} />
        {status}
      </div>
      <div className="board-wrap">
        <Board state={gameState} mySide={side} myTurn={myTurn} onMove={actions.move} />
      </div>
    </>
  );
}
