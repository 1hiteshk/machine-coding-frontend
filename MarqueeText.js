import React, { useState } from "react";

const Marquee = ({ speed = 12, direction = "left" }) => {
  const [isPaused, setIsPaused] = useState(false);
  const texts = ["Flipkart", "Myntra", "Jio", "Amazon"];

  // Duplicate the array to create a seamless infinite loop
  const repeatedTexts = [...texts, ...texts];

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <style>
        {`
          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          @keyframes marqueeReverse {
            from {
              transform: translateX(-50%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>

      {/* Marquee container */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          display: "flex",
          background: "lightgrey",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Animated track */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            width: "max-content",
            flexShrink: 0,
            animation: `${
              direction === "left" ? "marquee" : "marqueeReverse"
            } ${speed}s linear infinite`,
            // we can use pseudo class :hover to pause animation state or useState
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {repeatedTexts.map((text, index) => (
            <div
              key={index}
              style={{
                padding: "10px 20px",
                whiteSpace: "nowrap",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Infinite Marquee</h1>

      <Marquee speed={10} direction="right" />
    </div>
  );
}
