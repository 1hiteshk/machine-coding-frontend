import { useState } from "react";

/*   [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6], */

// Dynamically generates all possible winning combinations based on board size
const generateWinningPatterns = (n=3) => {
  const patterns = [];

  // Horizontal patterns [0,1,2] [3,4,5] [6,7,8]
  for (let r = 0; r < n; r++) {
    const row = Array.from({ length: n }, (_, c) => r * n + c);
    patterns.push(row);
  }

  // Vertical patterns  [0,3,6] [1,4,7] [2,5,8]
  for (let c = 0; c < n; c++) {
    const col = Array.from({ length: n }, (_, r) => r * n + c);
    patterns.push(col);
  }

  // Diagonal from top-left to bottom-right [0,4,8] ]
  const diag1 = Array.from({ length: n }, (_, i) => i * n + i);
  patterns.push(diag1);

  // Diagonal from top-right to bottom-left [2,4,6]
  // This is the reverse diagonal, so we calculate it by subtracting the index from n
  const diag2 = Array.from({ length: n }, (_, i) => i * n + (n - 1 - i));
  patterns.push(diag2);

  return patterns;
};

const useTicTacToe = (boardSize) => {
  console.log(`useTicTacToe: boardSize = ${boardSize}`);
  const initialBoard = () => Array(boardSize * boardSize).fill(null);
  const [board, setBoard] = useState(initialBoard()); // Stores the board state
  const [isXNext, setIsXNext] = useState(true); // Keeps track of current player

  const WINNING_PATTERNS = generateWinningPatterns(boardSize); // All winning combinations

  // Determines the winner by checking all winning patterns
  const calculateWinner = (currentBoard) => {
    for (const pattern of WINNING_PATTERNS) {
      // x [0,1,2] => 0 - X
      const first = currentBoard[pattern[0]]; // Check the first cell in the pattern
      if (!first) continue; // If the first cell is empty, skip this pattern
      // Check if all cells in the pattern match the first cell
      if (first && pattern.every((index) => currentBoard[index] === first)) {
        return first;
      }
    }
    return null;
  };

  // Handles user click on a cell
  const handleClick = (index) => {
    const winner = calculateWinner(board);
    if (winner || board[index]) return; // Ignore click if game over or cell filled

    // Update the board with the current player's symbol
    // Create a new board to avoid mutating the state directly
    // This is important in React to ensure state updates trigger re-renders
    const newBoard = [...board];

    newBoard[index] = isXNext ? "X" : "O";
    // Update the board state and switch player
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Returns status message: current turn, win, or draw
  const getStatusMessage = () => {
    const winner = calculateWinner(board);
    if (winner) return `Player ${winner} wins!`;
    if (!board.includes(null)) return `It's a draw!`;
    return `Player ${isXNext ? "X" : "O"} turn`;
  };

  // Resets the game state to initial
  const resetGame = () => {
    setBoard(initialBoard());
    setIsXNext(true);
  };

  return {
    board, // The game board
    handleClick, // Function to handle cell click
    calculateWinner, // Function to check winner
    getStatusMessage, // Game status message
    resetGame, // Reset the game
  };
};

export default useTicTacToe;
