import { useEffect, useRef, useState } from "react";
/* 
span {
  animation: hideAndShow 1s infinite;
  color: red; }
@keyframes hideAndShow {
  0% { opacity: 0; } ,
  100% { opacity: 1; }
}
*/
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h2>Typing Effect</h2>
      <TypingEffect text="I'm a Frontend Developer." delay="100" />
    </div>
  );
}
 function TypingEffect({ text, delay }) {
  const [displayText, setDisplayText] = useState(text);
  const velocityRef = useRef({ speed: 1, endIndex: 0 });
    // velocityRef keeps track of the current speed and end index for the text
    // endIndex is the current position in the text that is being displayed

  useEffect(() => {
    const interval = setInterval(() => {
      if (velocityRef.current.endIndex === text.length) {
        velocityRef.current.speed = -1;
      } else if (velocityRef.current.endIndex === 0) {
        velocityRef.current.speed = 1;
      }
        // Update the endIndex based on the current speed
      velocityRef.current.endIndex += velocityRef.current.speed;
        // Update the displayed text based on the current endIndex
      setDisplayText(text.slice(0, velocityRef.current.endIndex));
      
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, [delay, text]);
  return (
    <h1>
      {displayText}
      <span>.|</span>
    </h1>
  );
}
