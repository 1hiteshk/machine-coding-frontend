import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

export default function App() {
  const handleOTPComplete = (otp) => {
    console.log("Entered OTP:", otp);
    // Browser alert as a fallback
    alert(`OTP Entered: ${otp}`);
  };

  return (
    <div className="App p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">OTP Verification</h1>
      <h2 className="text-xl mt-6 mb-4">Alternative OTP Input</h2>
      <OTPInput2 length={6} onComplete={handleOTPComplete} />
    </div>
  );
}

const OTPInput2 = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputsRef = useRef([]);

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    const newValue = value.trim();
    newOtp[index] = newValue.slice(-1); // takes the last input
    setOtp(newOtp);

    // Move to next input if current is filled
    if (newValue && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Call onComplete if OTP is fully entered
    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(newOtp.join(""));
    }
  };
  console.log(otp);

  // Handle keyboard navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      const input = inputsRef.current[index - 1];
      if (input.value.length === 1) {
        const prevInput = inputsRef.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          requestAnimationFrame(() => {
            prevInput.setSelectionRange(1, 1);
          });
        }
        //  It ensures that setSelectionRange(1,1) is applied after the input field has received focus.
        //  Prevents race conditions where React re-renders might interfere with setting the cursor position.
        //  Between requestAnimationFrame and setTimeout, requestAnimationFrame is the better choice for updating the cursor position
      } else inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // auto focus on 1st input box on initial render
  useEffect(() => {
    // Auto-focus first input if enabled
    requestAnimationFrame(() => {
      if (inputsRef.current[0]) {
        inputsRef.current[0].focus();
      }
    });
  }, []); //Use requestAnimationFrame to ensure the focus is applied after the component is fully mounted:

  // Handle pasting of OTP
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^[0-9]+$/.test(pastedData)) return; // Ensure only numbers are pasted

    const newOtp = pastedData
      .split("")
      .concat(new Array(length - pastedData.length).fill(""));
    // Fill the rest with empty strings if pasted data is shorter than length
    setOtp(newOtp);
    inputsRef.current[newOtp.length - 1]?.focus();
    onComplete?.(newOtp.join(""));
  };

  return (
    <div className="flex space-x-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          value={digit}
          maxLength={1}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center border rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            height: "30px",
            width: "30px",
            textAlign: "center",
          }}
        />
      ))}
    </div>
  );
};
