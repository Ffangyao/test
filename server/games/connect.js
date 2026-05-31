// 连子类游戏工厂:五子棋(15,5)、井字棋(3,3) 共用
module.exports = function makeConnect(size, need) {
  return {
    createInitialState() {
      const board = Array.from({ length: size }, () => Array(size).fill(null));
      return { board, turn: 0, size, need, last: null };
    },
    validateMove(state, move, side) {
      if (side !== state.turn) return false;
      const { r, c } = move || {};
      if (!Number.isInteger(r) || !Number.isInteger(c)) return false;
      if (r < 0 || r >= size || c < 0 || c >= size) return false;
      return state.board[r][c] === null;
    },
    applyMove(state, move) {
      const board = state.board.map((row) => row.slice());
      board[move.r][move.c] = state.turn;
      return { ...state, board, turn: state.turn ^ 1, last: { r: move.r, c: move.c } };
    },
    checkResult(state) {
      const { last, board } = state;
      if (last) {
      const side = board[last.r][last.c];
        for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
        let count = 1;
          for (const sgn of [1, -1]) {
   let r = last.r + dr * sgn;
            let c = last.c + dc * sgn;
   while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === side) {
       count++;
              r += dr * sgn;
         c += dc * sgn;
      }
          }
          if (count >= need) return { winner: side };
        }
      }
      const full = board.every((row) => row.every((cell) => cell !== null));
      return full ? { draw: true } : null;
    },
  };
};
