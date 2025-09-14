// King.jsx
import React, { useState } from "react";

const boardSize = 8; // Standard chessboard size

function King() {
  // State to store which square is currently hovered (row, col)
  const [hovered, setHovered] = useState(null);

  // Check if the current square is the hovered one
  const isHoveredSquare = (row, col) => {
    return hovered && hovered[0] === row && hovered[1] === col;
  };

  // Check if a square is a valid King move from the hovered square
  const isKingMove = (row, col) => {
    if (!hovered) return false; // No hovered square → no moves
    const [hr, hc] = hovered;   // hr = hovered row, hc = hovered col

    const dr = Math.abs(hr - row); // row difference
    const dc = Math.abs(hc - col); // col difference

    // Valid King move: one step in any direction (excluding hovered square)
    return !isHoveredSquare(row, col) && dr <= 1 && dc <= 1;
  };

  // Generate the chessboard UI
  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        // Light and dark squares alternate
        const isLight = (row + col) % 2 === 0;
        let cellClasses = `cell ${isLight ? "light" : "dark"}`;

        // Apply special styles depending on hover/move
        if (isHoveredSquare(row, col)) {
          cellClasses += " hovered"; // Highlight hovered square
        } else if (isKingMove(row, col)) {
          cellClasses += " king-move"; // Highlight possible King moves
        }

        // Create each cell with hover behavior
        board.push(
          <div
            key={`${row}-${col}`}
            data-testid={`cell-${row}-${col}`}
            className={cellClasses}
            onMouseEnter={() => setHovered([row, col])}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Show King icon 👑 on hovered square */}
            {isHoveredSquare(row, col) && <span className="king-icon">👑</span>}
          </div>
        );
      }
    }
    return board;
  };

  // Render the board container
  return <div className="board">{renderBoard()}</div>;
}

export default King;
/* 
.board {
  display: grid;
  grid-template-columns: repeat(8, 40px);
  grid-template-rows: repeat(8, 40px);
  gap: 0;
  margin: 20px auto;
  border-radius: 8px;
  width: fit-content;
}

.cell {
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.light {
  background-color: #f0d9b5;
}

.dark {
  background-color: #b58863;
}

.hovered {
  background-color: #87cefa !important;
  box-shadow: inset 0 0 0 3px #3b82f6;
}

.king-move {
  background-color: #4682b4 !important;
}
 */