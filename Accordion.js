import "./styles.css";
import { useState } from "react";
export default function App() {
  const [active, setActive] = useState(-1);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      {Array(5)
        .fill("")
        .map((_, i) => (
          <Accordion
            key={i}
            label={`FAQ - ${i + 1}`}
            msg={`so the detailed explaination for ${i + 1}`}
            onClick={() => setActive(active === i ? -1 : i)} // ✅ toggle logic
            isOpen={i == active ? true : false}
          />
        ))}
    </div>
  );
}
const Accordion = ({ label, msg, isOpen, onClick }) => {
  // const [isOpen, setIsOpen] = useState(open);
  const handleClick = () => {
    onClick();
    // setIsOpen(p=>!p) for multi open
  };
  return (
    <div style={{ margin: "10px" }}>
      <div
        onClick={handleClick}
        style={{
          backgroundColor: "lightgray",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        <div>{label}</div>
        <div>{isOpen ? "^" : "v"}</div>
      </div>
      {isOpen && (
        <div
          style={{
            backgroundColor: "lightgray",
            textAlign: "left",
            padding: "10px",
          }}
        >
          {msg}
        </div>
      )}
    </div>
  );
};
