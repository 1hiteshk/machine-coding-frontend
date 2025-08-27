[
  {
    "question": "How many planets in solar system",
    "options": [
      { "text": "one", "isCorrect": false },
      { "text": "four", "isCorrect": false },
      { "text": "eight", "isCorrect": true },
      { "text": "nine", "isCorrect": false }
    ]
  },
  {
    "question": "How many moon in solar system",
    "options": [
      { "text": "one", "isCorrect": false },
      { "text": "four", "isCorrect": false },
      { "text": "eight", "isCorrect": true },
      { "text": "nine", "isCorrect": false }
    ]
  },
  {
    "question": "How many dino in solar system",
    "options": [
      { "text": "one", "isCorrect": false },
      { "text": "four", "isCorrect": false },
      { "text": "eight", "isCorrect": true },
      { "text": "nine", "isCorrect": false }
    ]
  },
  {
    "question": "How many countries in solar system",
    "options": [
      { "text": "one", "isCorrect": false },
      { "text": "four", "isCorrect": false },
      { "text": "eight", "isCorrect": true },
      { "text": "nine", "isCorrect": false }
    ]
  },
  {
    "question": "How many satellite in solar system",
    "options": [
      { "text": "one", "isCorrect": false },
      { "text": "four", "isCorrect": false },
      { "text": "eight", "isCorrect": true },
      { "text": "nine", "isCorrect": false }
    ]
  }
]

import { useState } from "react";
import "./styles.css";
import questions from "./questions.json";

export default function App() {
  const [currentQues, setCurrentQues] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const resetQuiz = () => {
    setCurrentQues(0);
    setUserAnswers([]);
  };
  const handleNextQues = (isCorrect) => {
    setCurrentQues(currentQues + 1);
    setUserAnswers([...userAnswers, isCorrect]);
  };
  return (
    <div className="App">
      <h1>Quiz App </h1>

      {currentQues < questions.length && (
        <Question
          question={questions[currentQues]}
          onAnsClick={handleNextQues}
        />
      )}

      {/* Result Component */}
      {currentQues === questions.length && (
        <Result
          userAnswers={userAnswers}
          questions={questions}
          resetQuiz={resetQuiz}
        />
      )}
    </div>
  );
}

const Question = ({ question, onAnsClick }) => {
  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <h2
        style={{
          backgroundColor: "lightgray",
          textAlign: "left",
          padding: "10px",
        }}
      >
        {question?.question}
      </h2>
      <ol>
        {question.options.map((o, i) => (
          <li>
            <button
              onClick={() => onAnsClick(o?.isCorrect)}
              style={{
                backgroundColor: "lightgray",
                textAlign: "left",
                padding: "10px",
                width: "100%",
                margin: "5px 0",
                cursor: "pointer",
                border: "none",
              }}
            >
              {o?.text}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

/* eslint-disable react/prop-types */

const Result = ({ userAnswers, questions, resetQuiz = () => {} }) => {
  const correctAnswers = userAnswers.filter((answer) => answer).length;

  return (
    <div className="results">
      <h2>Results</h2>
      <p>
        You answered {correctAnswers} out of {questions.length} questions{" "}
        <span
          onClick={resetQuiz}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          Click here to Retry
        </span>
      </p>
      <ol>
        {questions.map((question, index) => {
          const correctAns = question.options.find((o) => o.isCorrect);
          return (
            <li
              key={index}
              data-correct={userAnswers[index]}
              style={{
                color: userAnswers[index] ? "green" : "red",
                textAlign: "left",
              }}
            >
              Q{index + 1}. {question.question}
              <b>
                {question.options[index]
                  ? ""
                  : `- ${question.options.find((ans) => ans.isCorrect).text}`}
              </b>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
