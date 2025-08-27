import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <FlipCard />
    </div>
  );
}

import { useState } from "react";

function FlipCard({ frontText = "Front Side", backText = "Back Side" }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped((prev) => !prev);

  const cardStyles = {
    perspective: "1000px", // enables 3d effect for children ,from how far away to see the preserve 3D transformation effect
    width: "300px",
    height: "200px",
  };

  const containerStyles = {
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d", // Enables 3D children transforms
    transition: "transform 0.6s ease-in-out",// Smooth flip animation 
    // This CSS rule applies a transition effect when the transform property of an element changes.
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    backgroundColor: flipped ? "#a855f7" : "#3b82f6", // purple-500 or blue-500
    borderRadius: "1rem",
    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
    cursor: "pointer",
  };

  const faceStyles = {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden", // Hides back when front is visible and vice versa
    color: "white",
    fontSize: "1.25rem",
    fontWeight: 600,
    borderRadius: "1rem",
  };

  // Back face styles (rotated to appear when flipped)
  const backStyles = {
    ...faceStyles,// Inherit from faceStyles
    transform: "rotateY(180deg)",// Flip back face 180° to align with card rotation
  };

  return (
    <div style={cardStyles} onClick={handleFlip}>
      <div style={containerStyles}>{/* Inner container that flips */}
        <div style={faceStyles}>{frontText}</div>{/* Front face content */}
        <div style={backStyles}>{backText}</div>{/* Back face content */}
      </div>
    </div>
  );
}
/* 
In CSS, the perspective property defines how far the viewer (i.e., you) is from the object in 3D space.

🔍 What does perspective: '1000px' do?
It’s applied to the parent of a 3D-transformed element (in your case: cardStyles).

It creates a vanishing point, affecting how dramatic the 3D effect appears.

A lower value (e.g. 300px) creates a more intense 3D effect (stronger depth).

A higher value (e.g. 2000px) creates a more subtle 3D effect (flatter appearance).

📦 It has nothing to do with width
The width: '16rem' is just setting the size of the card component.
The perspective: '1000px' affects how its child (with rotateY(...)) appears in 3D space.

Think of perspective as the depth of a camera lens 📸 – it controls how you perceive the 3D flip. */