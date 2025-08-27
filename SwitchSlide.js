import { useState } from "react";
import "./styles.css";
/* 
.App {
  font-family: sans-serif;
  text-align: center;
}

.slider::before {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: aquamarine;
  width: 26px;
  height: 26px;
  border-radius: 100px;
  transition: all 0.3s ease;
}

// pseudo class 
.switch:has(input: checked) .slider {
  background-color: violet !important;
}

// pseudo class has is not supported in many browsers 
.switch:has(input: checked) .slider::before {
  left: calc(100% - 26px);
}

.slider.on::before {
  left: calc(100% - 30px); // 4px margin + 26px knob width 
}

// now can use it after tab then spacekey 
.switch:has(input:focus-visible) .slider {
  outline: 2px solid blue;
}

*/

export default function App() {
  const [isOn, setIsOn] = useState(false);
  const onToggle = () => setIsOn((p) => !p);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <SwitchToggle isOn={isOn} onToggle={onToggle} />
      <AccessibleSwitch isOn={isOn} onToggle={onToggle} label="Label" />
    </div>
  );
}

const SwitchToggle = ({ label = "", onToggle = () => {}, isOn = false }) => {
  return (
    <div
      style={{
        position: "relative",
        height: "34px",
        width: "200px",
        cursor: "pointer",
      }}
      className="switch"
    >
      <label htmlFor="slide">
        <input
          id="slide"
          type="checkbox"
          role="switch"
          aria-checked={isOn}
          checked={isOn}
          onChange={onToggle}
          style={{ opacity: 0 }}
        />
        <span
          className={`slider ${isOn ? "on" : ""}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: isOn ? "violet" : "#ccc",
            width: "75px",
            height: "100%",
            borderRadius: "100px",
            cursor: "pointer",
          }}
        ></span>
        <span style={{ cursor: "pointer" }}>label</span>
      </label>
    </div>
  );
};

const AccessibleSwitch = ({ isOn, onToggle, label }) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <span id="switch-label">{label}</span>
      <div
        role="switch"
        aria-checked={isOn}
        aria-labelledby="switch-label"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onToggle();
          }
        }}
        style={{
          position: "relative",
          width: "75px",
          height: "34px",
          borderRadius: "100px",
          backgroundColor: isOn ? "violet" : "#ccc",
          transition: "background-color 0.3s ease",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "4px",
            left: isOn ? "45px" : "4px",
            width: "26px",
            height: "26px",
            backgroundColor: "aquamarine",
            borderRadius: "100px",
            transition: "left 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};
