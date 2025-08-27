import { useEffect, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  // Track the index of the currently active light (0 = red, 1 = yellow, 2 = green)
  const [activeLight, setActiveLight] = useState(0);

  // Remaining time (in milliseconds) for the current light
  const [remainingTime, setRemainingTime] = useState(0);

  // Input box state for adding extra time
  const [inputTime, setInputTime] = useState("");

  // Ref to store the interval ID for clearing later
  const intervalId = useRef(null);

  // Lights array with default durations in milliseconds
  const lights = [
    { color: "red", time: 5000 },
    { color: "yellow", time: 10000 },
    { color: "green", time: 30000 },
  ];

  // Whenever the active light changes, reset the remainingTime to its default duration
  useEffect(() => {
    setRemainingTime(lights[activeLight].time);
  }, [activeLight]);

  // Countdown logic — runs every 1 second
  useEffect(() => {
    // Clear any previous interval
    clearInterval(intervalId.current);

    // Set a new interval to decrement the remaining time every second
    intervalId.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1000) {
          // Time is up → move to next light and reset remainingTime
          setActiveLight((p) => (p + 1) % lights.length);
          return 0;
        }
        // Reduce remainingTime by 1000 ms
        return prev - 1000;
      });
    }, 1000);

    // Cleanup the interval on unmount or re-run
    return () => clearInterval(intervalId.current);
  }, [activeLight]);

  // Manually activate a light
  const activateLight = (index) => {
    clearInterval(intervalId.current); // stop current timer
    setActiveLight(index); // switch to chosen light
  };

  // Add extra time (once) to current light by modifying remainingTime
  const addExtraTime = () => {
    const extra = parseInt(inputTime);
    if (!isNaN(extra) && extra > 0) {
      setRemainingTime((prev) => prev + extra * 1000); // add extra seconds (converted to ms)
      setInputTime(""); // clear input
    }
  };

  return (
    <div className="App">
      <h1>Traffic Light</h1>

      {/* Traffic lights visual */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          border: "1px solid black",
          width: "max-content",
          padding: "10px",
        }}
      >
        {lights.map((lt, i) => (
          <div
            key={i}
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              backgroundColor: i === activeLight ? lt.color : "grey", // active = colored, others = grey
            }}
          ></div>
        ))}
      </div>

      {/* Manual control buttons */}
      <div style={{ marginTop: "20px" }}>
        {lights.map((lt, i) => (
          <button key={lt.color} onClick={() => activateLight(i)}>
            {lt.color.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Extra time input */}
      <div style={{ marginTop: "20px" }}>
        <label>
          Add extra time (sec) to {lights[activeLight].color} light:
          <input
            type="number"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)} // capture input
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button onClick={addExtraTime} style={{ marginLeft: "10px" }}>
          Add Time
        </button>
      </div>

      {/* Display remaining countdown time */}
      <div style={{ marginTop: "20px", fontSize: "18px" }}>
        Remaining time for {lights[activeLight].color.toUpperCase()}:{" "}
        <strong>{Math.ceil(remainingTime / 1000)}s</strong>
      </div>
    </div>
  );
}


/* 
✅ Great — you want:
A countdown timer that:

Shows how much time is left for the active light
Supports temporarily adding time mid-cycle
Adjusts remaining time based on when user adds it
Reverts back to the default duration in the next cycle

✅ Plan
Keep a remainingTime state (ms) — this is what we count down
Use a setInterval (every 1 sec) to reduce remainingTime by 1000 ms

On activeLight change:
Reset remainingTime = defaultTime

On user input:
Add N seconds to remainingTime
*/