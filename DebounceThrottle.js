import { useState, useCallback, useRef } from "react";
import "./styles.css";
/* debounce: delays updates until user stops typing.
throttle: limits updates to once every X ms, no matter how fast the user types.
✅ What it does:
Creates a stable debounced function that doesn't get recreated on every re-render.
debounce(...) returns a closure with a timer variable inside. 
If we create a new debounced function every render, the old timer is lost. So debounce won't work.
🔥 If we DON'T use useCallback:
A new debounced function is created on every render.
Every keypress = new function = old timer gone = debounce never delays correctly.
Debouncing will not work at all, or behave erratically.

✅ What it does:
Keeps the same throttled function reference across renders.
useRef(...).current preserves the throttled function (and its lastCall time).
🔥 If we DON'T use useRef:
On each render, a new throttled function is created.
This resets lastCall = 0, so throttle logic restarts every time.
You’ll get unexpected behavior — might call the function too often or not at all.

🧠 TL;DR
useCallback: ensures debounced function is stable (1 instance).
useRef: ensures throttled function persists (keeps internal state).
Both optimize performance and avoid re-creating expensive functions. */

const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
const throttle = (func, delay) => {
  let lastCall = 0;
  return function (...args) {
    let now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  };
};

export default function App() {
  const [input, setInput] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [throttledInput, setThrottledInput] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
  };
  const debounceFn = useCallback(
    debounce((value) => setDebouncedInput(value), 3000),
    [] // persist across re renders
  );
  const handleDebounce = (e) => {
    setInput2(e.target.value);
    debounceFn(e.target.value);
  };
  const throttleFnRef = useRef(
    throttle((value) => {
      setThrottledInput(value);
    }, 3000)
  );
  const handleThrottle = (e) => {
    setInput3(e.target.value);
    throttleFnRef.current(e.target.value);
  };
  return (
    <div className="App">
      <div>
        <input type="text" value={input} onChange={handleChange} />
        <div>input: {input}</div>
      </div>
      <div>
        <input type="text" value={input2} onChange={handleDebounce} />
        <div>debounce: {debouncedInput}</div>
      </div>
      <div>
        <input type="text" value={input3} onChange={handleThrottle} />
        <div>throttle: {throttledInput}</div>
      </div>
    </div>
  );
}

// in the render body, then every render creates a new debouncedFn with its own timer, which breaks debounce.

// ✅ useCallback or useRef → both work
// 🚫 Defining in render → always wrong for debounce/throttle

//If you don’t use useCallback or useRef, and define your debounced function directly inside the component body (render) — like this:

// const debouncedFn = debounce((value) => setDebouncedInput(value), 1000);
// Then a brand new debounced function is created on every re-render.

// 🔥 What Goes Wrong
// ✅ Expected debounce behavior:
// You type fast

// Timer resets until 1000ms pause

// Only the last value is used

// ❌ What happens without useCallback or useRef:
// Every keypress triggers a re-render

// New debouncedFn is created

// Previous timer is lost

// Debounce never actually triggers

// You might see setDebouncedInput either:

// Triggering every keystroke (defeating debounce)

// Or never firing at all (if React batches updates)

// 🎯 Summary of Difference
// Pattern	Timer persists?	Debounce works?	Function re-created each render?
// ✅ useRef or useCallback	✅ Yes	✅ Yes	❌ No
// ❌ Direct in render	❌ No	❌ Broken	✅ Yes

// ✅ Rule of Thumb
// If your function:

// Holds internal state (like timer)

// Needs to persist across renders

// 👉 Wrap it with useRef or useCallback([])
// This ensures it behaves correctly without losing its timer or state.

async function test() {
  console.log("1");

  setTimeout(() => console.log("2"), 0);

  await Promise.resolve().then(() => console.log("3"));

  console.log("4");

  await new Promise((resolve) => {
    console.log("5");
    resolve();
  }).then(() => console.log("6"));

  console.log("7");
  Promise.resolve(42)
    .then((value) => {})
    .then((value) => console.log(value));
}

test();
console.log("8");
