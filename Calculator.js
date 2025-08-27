import React, { useState } from "react";

const BUTTONS = [
  { symbol: "C", onClick: "clear", className: "clear-btn" },
  { symbol: "√", onClick: "√(" },
  { symbol: "%", onClick: "%" },
  { symbol: "/", onClick: "/" },
  ...["7", "8", "9"].map((d) => ({ symbol: d, onClick: d })),
  { symbol: "✕", onClick: "*" },
  ...["4", "5", "6"].map((d) => ({ symbol: d, onClick: d })),
  { symbol: "-", onClick: "-" },
  ...["1", "2", "3"].map((d) => ({ symbol: d, onClick: d })),
  { symbol: "+", onClick: "+" },
  ...["0", ".", "(", ")"].map((s) => ({ symbol: s, onClick: s })),
  { symbol: "←", onClick: "back", className: "back-btn" },
  { symbol: "=", onClick: "evaluate", className: "equal-btn" },
];

function evaluateExpression(expr) {
  try {
    const transformed = expr.replace(/√\(/g, "Math.sqrt(");
    const result = Function(`"use strict"; return (${transformed})`)();
    // eval(transformed)
    return result.toString();
  } catch {
    return "Error";
  }
}

function Calculator() {
  const [input, setInput] = useState("");

  const handleButtonClick = (action) => {
    if (action === "clear") return setInput("");
    if (action === "back") return setInput((prev) => prev.slice(0, -1));
    if (action === "evaluate") return setInput(evaluateExpression(input));
    setInput((prev) => prev + action);
  };

  return (
    <div className="calculator-container">
      <h1 className="title">Simple Calculator</h1>
      <input
        className="display"
        placeholder="Enter expression"
        type="text"
        value={input}
        readOnly
      />
      <div
        className="button-grid"
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "repeat(4,1fr)",
        }}
      >
        {BUTTONS.map(({ symbol, onClick, className = "" }, index) => (
          <button
            key={index}
            className={className}
            onClick={() => handleButtonClick(onClick)}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
