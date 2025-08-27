import "./styles.css";
const n = 8;
export default function App() {
  const chess = Array.from({ length: n * n }, (_, i) => i);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gap: 0,
          width: "max-content", // bcoz of width we can see gap
          border: "2px solid black", // outer border only
        }}
      >
        {chess.map((itm, idx) => {
          const row = Math.floor(idx / n);
          const col = idx % n;
          const isWhite = (row + col) % 2 === 0;

          return (
            <div
              key={idx}
              style={{
                display: "inline",
                border: "1px solid black",
                height: "50px",
                width: "50px",
                backgroundColor: isWhite ? "white" : "#333", // dark gray instead of border
              }}
            />
          );
        })}
      
      </div>
    </div>
  );
}
