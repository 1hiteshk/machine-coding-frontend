import React, { useState } from "react";

const boardSize = 8;

function King() {
  const [hovered, setHovered] = useState(null);

  const isHoveredSquare = (row, col) => {
    return hovered && hovered[0] === row && hovered[1] === col;
  };

  const isKingMove = (row, col) => {
    if (!hovered) return false;
    const [hr, hc] = hovered;

    const dr = Math.abs(hr - row);
    const dc = Math.abs(hc - col);

    return !isHoveredSquare(row, col) && dr <= 1 && dc <= 1;
  };

  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const isLight = (row + col) % 2 === 0;
        let cellClasses = `cell ${isLight ? "light" : "dark"}`;

        if (isHoveredSquare(row, col)) {
          cellClasses += " hovered";
        } else if (isKingMove(row, col)) {
          cellClasses += " king-move";
        }

        board.push(
          <div
            key={`${row}-${col}`}
            data-testid={`cell-${row}-${col}`}
            className={cellClasses}
            onMouseEnter={() => setHovered([row, col])}
            onMouseLeave={() => setHovered(null)}
          >
            {isHoveredSquare(row, col) && <span className="king-icon">👑</span>}
          </div>
        );
      }
    }
    return board;
  };

  return <div className="board">{renderBoard()}</div>;
}

export default King;
