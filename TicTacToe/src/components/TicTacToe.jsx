import useTicTacToe from "../hooks/useTicTacToe";


function TicTacToe({boardSize}) {
  const {board, handleClick, resetGame, getStatusMessage} = useTicTacToe(boardSize);

  return (
    <div className="game">
      <div className="status">
        {getStatusMessage()}
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>

      <div className="board" style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`}}>
        {board.map((b, index) => {
          return (
            <button
              className="cell"
              key={index}
              onClick={() => handleClick(index)}
              disabled={b !== null}
            >
              {b}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TicTacToe;