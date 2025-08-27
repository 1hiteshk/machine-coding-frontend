import { useState, useEffect, useRef } from "react";
import "./styles.css";

const WORDS = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Custard",
  "Doughnut",
  "Eclair",
  "Fruit",
  "Gelato",
  "Honey",
  "Ice Cream",
  "Jam",
  "Jelly",
  "Ketchup",
  "Lemon",
  "Lime",
  "Maple",
  "Mango",
  "Marmalade",
  "Nectar",
  "Nutella",
  "Oatmeal",
  "Orange",
  "Papaya",
  "Pineapple",
  "Pistachio",
  "Pizza",
  "Quiche",
  "Raspberry",
  "Salad",
  "Scone",
  "Strawberry",
  "Tiramisu",
  "Vanilla",
  "Watermelon",
];

export default function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debounceTimer = useRef(null);

  const filterWords = (value) => {
    const filtered = WORDS.filter((w) =>
      w.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
    setHighlightedIndex(-1);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => filterWords(value), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      setInput(results[highlightedIndex]);
      setResults([]);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="App">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{ width: "300px" }}
      />
      <ul style={{ listStyle: "none", paddingLeft: 0, width: "300px" }}>
        {results.map((word, i) => (
          <li
            key={word}
            style={{
              backgroundColor: i === highlightedIndex ? "#ddd" : "transparent",
              padding: "4px",
              cursor: "pointer",
              textAlign: "left",
            }}
            onMouseEnter={() => setHighlightedIndex(i)}
            onClick={() => {
              setInput(word);
              setResults([]);
              setHighlightedIndex(-1);
            }}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}
