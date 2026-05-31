// 中国象棋 10 行 x 9 列。side 0 = 红(下方 5..9),side 1 = 黑(上方 0..4)
// 棋子 { s, t },t ∈ K将 A士 E象 H马 R车 C炮 P兵。胜负:吃掉对方 K 即获胜
const ROWS = 10;
const COLS = 9;

function inBoard(r, c) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}
function inPalace(r, c, s) {
  if (c < 3 || c > 5) return false;
  return s === 0 ? r >= 7 && r <= 9 : r >= 0 && r <= 2;
}
function ownSide(r, s) {
  return s === 0 ? r >= 5 : r <= 4;
}
// 直线(横或竖)上 from 与 to 之间的棋子数
function between(board, from, to) {
  const dr = Math.sign(to.r - from.r);
  const dc = Math.sign(to.c - from.c);
  let r = from.r + dr;
  let c = from.c + dc;
  let n = 0;
  while (r !== to.r || c !== to.c) {
  if (board[r][c]) n++;
    r += dr;
    c += dc;
  }
  return n;
}

function legal(board, from, to, s) {
  const p = board[from.r][from.c];
  const dr = to.r - from.r;
  const dc = to.c - from.c;
  const adr = Math.abs(dr);
  const adc = Math.abs(dc);
  const target = board[to.r][to.c];
  const ortho = (dr === 0) !== (dc === 0); // 恰好横或竖直线
  switch (p.t) {
  case 'K': {
    if (adr + adc === 1 && inPalace(to.r, to.c, s)) return true;
      // 飞将:同列、对方为将、中间无子时可直接吃
      if (dc === 0 && target && target.t === 'K' && between(board, from, to) === 0) return true;
      return false;
    }
    case 'A':
      return adr === 1 && adc === 1 && inPalace(to.r, to.c, s);
    case 'E': {
  if (!(adr === 2 && adc === 2)) return false;
      if (!ownSide(to.r, s)) return false; // 不可过河
      return board[from.r + dr / 2][from.c + dc / 2] === null; // 不塞象眼
    }
    case 'H': {
      if (adr === 2 && adc === 1) return board[from.r + dr / 2][from.c] === null;
      if (adc === 2 && adr === 1) return board[from.r][from.c + dc / 2] === null;
      return false;
 }
    case 'R':
      return ortho && between(board, from, to) === 0;
    case 'C': {
   if (!ortho) return false;
      const cnt = between(board, from, to);
      return target ? cnt === 1 : cnt === 0; // 吃子隔一,移动无阻
    }
    case 'P': {
      const fwd = s === 0 ? -1 : 1;
      const crossed = s === 0 ? from.r <= 4 : from.r >= 5;
      if (dr === fwd && dc === 0) return true;
      if (crossed && dr === 0 && adc === 1) return true;
      return false;
    }
    default:
      return false;
  }
}

function place(board, r, c, s, t) {
  board[r][c] = { s, t };
}

module.exports = {
  createInitialState() {
    const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    const back = ['R', 'H', 'E', 'A', 'K', 'A', 'E', 'H', 'R'];
    for (const s of [0, 1]) {
  const backRow = s === 0 ? 9 : 0;
    const cannonRow = s === 0 ? 7 : 2;
      const pawnRow = s === 0 ? 6 : 3;
      back.forEach((t, c) => place(board, backRow, c, s, t));
      place(board, cannonRow, 1, s, 'C');
 place(board, cannonRow, 7, s, 'C');
      for (const c of [0, 2, 4, 6, 8]) place(board, pawnRow, c, s, 'P');
    }
    return { board, turn: 0 };
  },
  validateMove(state, move, side) {
    if (side !== state.turn) return false;
    const { from, to } = move || {};
    if (!from || !to || !inBoard(from.r, from.c) || !inBoard(to.r, to.c)) return false;
    if (from.r === to.r && from.c === to.c) return false;
    const p = state.board[from.r][from.c];
    if (!p || p.s !== side) return false;
    const target = state.board[to.r][to.c];
    if (target && target.s === side) return false; // 不能吃自己
    return legal(state.board, from, to, side);
  },
  applyMove(state, move) {
    const board = state.board.map((row) => row.slice());
board[move.to.r][move.to.c] = board[move.from.r][move.from.c];
    board[move.from.r][move.from.c] = null;
    return { board, turn: state.turn ^ 1 };
  },
  checkResult(state) {
    let red = false;
    let black = false;
    for (const row of state.board) {
      for (const cell of row) {
        if (cell && cell.t === 'K') {
          if (cell.s === 0) red = true;
          else black = true;
        }
   }
    }
    if (!red) return { winner: 1 };
    if (!black) return { winner: 0 };
    return null;
  },
};
