// 黑白棋 8x8。side 0 = 黑(先手),side 1 = 白
const SIZE = 8;
const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

// 在 (r,c) 落 side 子可翻转的对方棋子坐标列表
function flips(board, r, c, side) {
  if (board[r][c] !== null) return [];
  const opp = side ^ 1;
  const res = [];
  for (const [dr, dc] of DIRS) {
    const line = [];
    let rr = r + dr;
    let cc = c + dc;
    while (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && board[rr][cc] === opp) {
      line.push([rr, cc]);
      rr += dr;
      cc += dc;
    }
    if (line.length && rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && board[rr][cc] === side) {
      res.push(...line);
    }
  }
  return res;
}

function hasMove(board, side) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === null && flips(board, r, c, side).length) return true;
    }
  }
  return false;
}

module.exports = {
  createInitialState() {
    const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    board[3][3] = 1;
    board[3][4] = 0;
    board[4][3] = 0;
    board[4][4] = 1;
    return { board, turn: 0, last: null };
  },
  validateMove(state, move, side) {
    if (side !== state.turn) return false;
    const { r, c } = move || {};
    if (!Number.isInteger(r) || !Number.isInteger(c)) return false;
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return false;
    return flips(state.board, r, c, side).length > 0;
  },
  applyMove(state, move) {
    const board = state.board.map((row) => row.slice());
    const side = state.turn;
    const fl = flips(board, move.r, move.c, side);
    board[move.r][move.c] = side;
    for (const [r, c] of fl) board[r][c] = side;
    let turn = side ^ 1;
    // 对方无子可下则跳过;若己方也无子,留待 checkResult 判定终局
    if (!hasMove(board, turn)) turn = hasMove(board, side) ? side : turn;
    return { board, turn, last: { r: move.r, c: move.c } };
  },
  checkResult(state) {
    const { board } = state;
    if (hasMove(board, 0) || hasMove(board, 1)) return null;
    let a = 0;
    let b = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell === 0) a++;
        else if (cell === 1) b++;
      }
    }
    if (a === b) return { draw: true };
    return { winner: a > b ? 0 : 1 };
  },
};
