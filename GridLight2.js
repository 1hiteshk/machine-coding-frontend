/* 
· Represent the grid as a 2D array using React's useState, initializing all cells with 0 (off).
· Render the grid using nested .map() loops to create rows and cells. 
Each cell should be clickable and trigger a toggle function. When a cell is clicked, toggle:
  - The clicked cell itself (row, col)
  - Its adjacent neighbors:
    - Top: (row - 1, col) if row > 0
    - Bottom: (row + 1, col) if row < n - 1
    - Left: (row, col - 1) if col > 0
    - Right: (row, col + 1) if col < n - 1
· Toggling means switching the value from 0 to 1 or 1 to 0.
· Always work on a deep copy of the grid to avoid direct state mutation. 
After toggling the required cells, update the state using setGrid with the new grid.
· Use conditional styling to display cell color:
  - A cell with value 1 (on) can be styled as yellow
  - A cell with value 0 (off) can be styled as gray
· Ensure all clicks correctly respect grid boundaries to avoid index errors. 
The updated grid should re-render automatically as state changes.
*/

import { useState } from "react";
// GridLight.jsx

const GridLights = ({ size = 5 }) => {
  const [grid, setGrid] = useState(
    Array(size)
      .fill(null)
      .map(() => Array(size).fill(0))
  ); // grid size 5x5
  // define an array of directions to describe current cell and neighbours, to togglw b/w on(1) and off(0)

  const toggle = (row, col) => {
    const directions = [
      [0, 0], //current
      [-1, 0], //top
      [1, 0], // bottom
      [0, -1], // left
      [0, 1], // right
    ];
    // creating copy of current grid to avoid mutating state directly via mapping and updating the grid
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);

      directions.forEach(([dx, dy]) => {
        const x = row + dx;
        const y = col + dy;

        // x and y are valid indices
        if (x >= 0 && x < size && y >= 0 && y < size) {
          //only toggle the lights if its within the grid bounds
          newGrid[x][y] = newGrid[x][y] === 0 ? 1 : 0;
        }
      });
      return newGrid;
    });
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>Grid Lights</h2>
      <div>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                onClick={() => toggle(rowIndex, colIndex)}
                role="cell"
                style={{
                  width: 40,
                  height: 40,
                  margin: 2,
                  backgroundColor: cell === 1 ? "gold" : "lightgray",
                  border: "1px solid black",
                  cursor: "pointer",
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export default GridLights;
