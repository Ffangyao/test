// 五子棋 / 井字棋 共用:点击空格落子
export default function ConnectBoard({ state, myTurn, onMove }) {
  const { board, size, last } = state;
  // 桌面用固定尺寸,手机按屏宽自适应缩放
  const cell = size > 9 ? 'min(30px, calc((100vw - 48px) / 15))' : 'min(76px, calc((100vw - 48px) / 3))';
  return (
  <div className="grid-board" style={{ gridTemplateColumns: `repeat(${size}, ${cell})` }}>
{board.map((row, r) =>
        row.map((v, c) => {
       const isLast = last && last.r === r && last.c === c;
          return (
            <div
      key={`${r}-${c}`}
       className={`cell${isLast ? ' last' : ''}`}
    style={{ width: cell, height: cell }}
              onClick={() => myTurn && v === null && onMove({ r, c })}
>
           {v !== null && <div className={`stone s${v}`} />}
     </div>
      );
        })
      )}
    </div>
  );
}
