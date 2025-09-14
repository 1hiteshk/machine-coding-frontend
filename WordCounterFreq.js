// Import React hooks
import { useState, useEffect } from "react";

function WordCounter() {
  // State to hold user input text
  const [text, setText] = useState("");

  // State to hold array of words and their counts
  const [count, setCount] = useState([]);

  // Function to process the text and count word frequencies
  function handleCount() {
    // Convert to lowercase, remove all non-letters except spaces, and trim
    const cleanedText = text.toLowerCase().replace(/[^a-zA-Z\s]/g, "").trim();

    // If cleaned text is empty, reset count to [] and exit
if (!cleanedText) {
setCount([]);
return;
}

    // Split cleaned text into words using whitespace (1+ spaces) as separator
    const words = cleanedText.split(/\s+/);

    // Use Map to store word counts (key=word, value=frequency)
    const wordMap = new Map();

    // Count how many times each word appears
    words.forEach((word) => {
      wordMap.set(word, (wordMap.get(word) || 0) + 1);
    });

    /**
     * Convert map to array => [ [word, count], [word, count], ... ]
     * Sort array in descending order of count:
     *   - a[1] = count of first word
     *   - b[1] = count of second word
     *   - b[1] - a[1] makes sure higher counts come first
     */
    const sortedArray = Array.from(wordMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    // Update state with sorted array of word frequencies
    setCount(sortedArray);
  }

  // Run handleCount whenever text changes
  useEffect(() => {
    handleCount();
  }, [text]);

  return (
    <div className="wordCounter">
      <h1>Word Counter</h1>

      <div className="container">
        <textarea
          className="textarea"
          placeholder="Type your text here"
          data-testid="textarea"
          onChange={(e) => setText(e.target.value)} // Update state on input
        ></textarea>

        {/* Show results only if there is at least one word */}
        {count.length > 0 && (
          <div className="results">
            <h3>Word Frequencies</h3>
            <ul data-testid="result-list">
              {count.map(([word, count]) => (
                <li key={word} data-testid={`word-${word}`}>
                  <strong>{word}</strong>: {count} Times
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
export default WordCounter;
