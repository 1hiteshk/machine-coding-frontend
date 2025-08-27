import "./styles.css";
const n = 50;

export default function App() {
  // Proper n x n grid
  const chess2 = Array.from({ length: n }, (_, row) =>
    Array.from({ length: n }, (_, col) => (row + col) % 2 === 0 ? "white" : "#ccc")
  );

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Chessboard Grid</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gap: 0,
          height: "100vh",
          width: "100vw"
        }}
      >
        {chess2.flat().map((color, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: color,
              border: "1px solid black"
            }}
          />
        ))}
      </div>
    </div>
  );
}
