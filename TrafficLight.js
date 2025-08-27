import { useEffect, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  const [activeLight, setActiveLight] = useState(0);
  const timeoutId = useRef(null);

  const lights = [
    { color: "red", time: 5000 },
    { color: "yellow", time: 10000 },
    { color: "green", time: 3000 },
  ];

  // Recursive timeout to change light
  useEffect(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setActiveLight((prev) => (prev + 1) % lights.length);
    }, lights[activeLight].time);

    return () => clearTimeout(timeoutId.current);
  }, [activeLight, lights]);

  // Manual light override
  const activateLight = (index) => {
    clearTimeout(timeoutId.current);
    setActiveLight(index);
  };

  return (
    <div className="App">
      <h1>Traffic Light</h1>

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
              backgroundColor: i === activeLight ? lt.color : "grey",
            }}
          ></div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        {lights.map((lt, i) => (
          <button key={lt.color} onClick={() => activateLight(i)}>
            {lt.color.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}


/* 
✅ TL;DR
Use setTimeout in React when you need precise, state-driven behavior like:

Traffic lights
Auto-playing slideshows
Delays that change dynamically

Use setInterval only when:

Delay is fixed and not state-dependent
You manage cleanup and state very carefully

🔬 Performance Comparison
| Aspect       | `setInterval`                              | `setTimeout`                              |
| ------------ | ------------------------------------------ | ----------------------------------------- |
| CPU load     | ✅ Slightly less (no reset overhead)        | ❌ Slightly more (resets timer each cycle) |
| Timing drift | ❌ More prone to drift/overlap              | ✅ Better precision per cycle              |
| Async safety | ❌ Poor if function takes longer than delay | ✅ Waits until previous completes          |
| React usage  | ❌ Often buggy with stale closures          | ✅ Better sync with React state            |

🧠 Core Difference Between setInterval vs setTimeout
| Feature             | `setInterval`                             | `setTimeout`                            |
| ------------------- | ----------------------------------------- | --------------------------------------- |
| 🔁 Repeats?         | Yes, automatically (fixed interval)       | No, only once                           |
| 📦 Schedule control | Fixed loop, no wait for execution finish  | More precise – waits between calls      |
| ⚠️ Stale state risk | ✅ High (needs clear+reset to sync)        | ❌ Low (can access fresh state via deps) |
| 🧹 Cleanup in React | ❌ Tricky (requires careful clearInterval) | ✅ Easy and safe                         |
| 🧠 Best for React?  | ❌ Avoid if state-driven                   | ✅ Preferred for timing based on state   |

*/