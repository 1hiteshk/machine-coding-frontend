import { useState } from "react";

function UndoRedo() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleChange(e) {
    const newText = e.target.value;
    const newHistory = history.slice(0, currentIndex + 1);
    setHistory([...newHistory, newText]);
    setCurrentIndex(newHistory.length);
    setText(newText);
  }

  function handleRedo() {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setText(history[currentIndex + 1]);
    }
  }

  function handleUndo() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setText(history[currentIndex - 1]);
    }
  }

  return (
    <div className="undoRedo">
      <h1>Undo Redo History</h1>

      <div className="container">
        <textarea onChange={handleChange} data-testid="textarea" value={text} />

        <div className="buttons">
          <button
            onClick={handleRedo}
            disabled={currentIndex === history.length - 1}
            data-testid="redo-button"
          >
            Redo
          </button>
          <button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            data-testid="undo-button"
          >
            Undo
          </button>
        </div>
      </div>
    </div>
  );
}

export default UndoRedo;
