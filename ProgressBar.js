import { useEffect, useState } from "react";
import "./styles.css";

const ProgressBar = ({ progress }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  useEffect(() => {
    setTimeout(() => setAnimatedProgress(progress), 100);
  }, [progress]);

  return (
    <div
      style={{
        margin: "10px 0",
        border: "1px solid black",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "green",
          padding: "1px",
          textAlign: "right",
          transition: "1s ease-in-out",
          // width: `${animatedProgress}%`, here browser has to repaint the whole css again and again
          transform: `translateX(${animatedProgress - 100}%)`, // this is a good & performant way gives smooth animation not jitteriness
          color: progress < 5 ? "black" : "white",
        }}
        role="progressbar" // Tells assistive tech that this <div> behaves like a progress bar.
        aria-valuenow={progress}  // Current progress (e.g., 45) 
        aria-valuemax="100" // Define the range of possible values.
        aria-valuemin={"0"}
        aria-label="File upload progress"
        /* Helps screen readers say something like:
“Progress bar at 45 percent, minimum 0, maximum 100” */
      >
        {progress}%
      </div>
    </div>
  );
};

export default function App() {
  const [bars, setBars] = useState([1, 5, 10, 25, 40, 60, 70, 90, 100]);
  return (
    <div className="App">
      <h1>Progress Bar</h1>
      <button onClick={() => setBars((prev) => [...prev, 50])}>50</button>
      {bars.map((bar) => (
        <ProgressBar key={bar} progress={bar} />
      ))}
    </div>
  );
}
