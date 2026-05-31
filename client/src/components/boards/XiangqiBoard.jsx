import { useState } from 'react';

// 棋子文字:[红, 黑]
const CHAR = {
  K: ['帥', '將'],
  A: ['仕', '士'],
  E: ['相', '象'],
  H: ['傌', '馬'],
  R: ['俥', '車'],
  C: ['炮', '砲'],
  P: ['兵', '卒'],
};

export default function XiangqiBoard({ state, mySide, myTurn, onMove }) {
  const { board } = state;
  const [sel, setSel] = useState(null);

  function click(r, c) {
 if (!myTurn) return;
    const p = board[r][c];
    if (p && p.s === mySide) {
  setSel({ r, c });
    } else if (sel) {
      onMove({ from: sel, to: { r, c } });
      setSel(null);
    }
  }

  return (
    <div className="xq">
      {board.map((row, r) =>
        row.map((p, c) => {
   const selected = sel && sel.r === r && sel.c === c;
          const target = sel && (!p || p.s !== mySide);
       return (
<div
           key={`${r}-${c}`}
    className={`pt${selected ? ' sel' : ''}${target ? ' target' : ''}`}
        onClick={() => click(r, c)}
          >
   {p && (
         <div className={`piece ${p.s === 0 ? 'red' : 'black'}`}>{CHAR[p.t][p.s]}</div>
  )}
  </div>
        );
        })
      )}
    </div>
  );
}
