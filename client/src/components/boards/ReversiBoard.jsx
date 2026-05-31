const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

// 客户端复算合法落点,仅用于提示(权威校验仍在服务端)
function canPlay(board, r, c, side) {
  if (board[r][c] !== null) return false;
  const opp = side ^ 1;
  for (const [dr, dc] of DIRS) {
    let rr = r + dr;
    let cc = c + dc;
    let seen = 0;
    while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && board[rr][cc] === opp) {
      seen++;
      rr += dr;
      cc += dc;
    }
 if (seen && rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && board[rr][cc] === side) return true;
  }
  return false;
}

export default function ReversiBoard({ state, mySide, myTurn, onMove }) {
  const { board } = state;
  return (
    <div className="reversi">
      {board.map((row, r) =>
        row.map((v, c) => {
      const hint = myTurn && canPlay(board, r, c, mySide);
  return (
        <div key={`${r}-${c}`} className="cell" onClick={() => hint && onMove({ r, c })}>
   {v !== null && <div className={`stone s${v}`} />}
           {hint && <div className="hint" />}
        </div>
    );
     })
      )}
    </div>
  );
}
