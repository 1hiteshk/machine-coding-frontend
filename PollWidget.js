// File: src/components/PollWidget.jsx
/* 
PollWidget.jsx: Displays a dummy poll, lets user vote or remove vote.

Votes are simulated in the frontend using dummy data and setTimeout to mock API delay.

multiSelect={false} means user can vote for only one option.


*/
import React, { useEffect, useState } from "react";

// Static dummy poll data
const dummyPoll = {
  id: "frontend_poll_1",
  question: "Best YT Channel to learn Frontend?",
  options: [
    { id: "opt1", text: "Great Frontend", votes: 11 },
    { id: "opt2", text: "Algo Matter", votes: 6 },
    { id: "opt3", text: "All the Above", votes: 6 },
  ],
  votedOptions: [], 
  /* 🧩 First: Why Do We Need votedOptions?
Think of votedOptions as a memory list 📒. It stores which options you already voted for. This way:
We disable voting again until you remove your previous vote.
We highlight your selected option (like coloring the one you clicked! 🎨).
Helps us know what to un-vote if you change your mind. */
};

// PollWidget component definition
function PollWidget({ pollId = "frontend_poll_1", multiSelect = true }) {
  // Component states
  const [pollData, setPollData] = useState(null);        // current poll data
  const [selected, setSelected] = useState([]);          // options selected by user
  const [loading, setLoading] = useState(false);         // loading state
  const [votedOptions, setVotedOptions] = useState([]);  // options user already voted for

  // Fetch poll data on component mount or pollId change
  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  // Simulate fetching poll data from backend
  const fetchPoll = async () => {
    setLoading(true);
    setTimeout(() => {
      setPollData(dummyPoll);
      setVotedOptions(dummyPoll.votedOptions || []);
      setLoading(false);
    }, 500);
  };

  // Handle user selection of option(s)
  const handleSelect = (optionId) => {
    if (!multiSelect) {
      setSelected([optionId]);
    } else {
      setSelected((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  // Simulate vote submission
  const handleVote = async () => {
    if (!selected.length) return;
    setLoading(true);
    setTimeout(() => {
      const updatedOptions = pollData.options.map((opt) =>
        selected.includes(opt.id) ? { ...opt, votes: opt.votes + 1 } : opt
      );
      setPollData({ ...pollData, options: updatedOptions });
      setVotedOptions((prev) => [...prev, ...selected]);
      setSelected([]);
      setLoading(false);
    }, 500);
  };

  // Simulate vote removal
  const handleRemoveVote = async () => {
    setLoading(true);
    setTimeout(() => {
      const updatedOptions = pollData.options.map((opt) =>
        votedOptions.includes(opt.id) ? { ...opt, votes: opt.votes - 1 } : opt
      );
      setPollData({ ...pollData, options: updatedOptions });
      setVotedOptions([]);
      setLoading(false);
    }, 500);
  };

  // Show loader while loading data
  if (loading || !pollData) {
    return <div>Loading Poll...</div>;
  }

  // Total votes for calculating percentage
  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "28rem",
        borderRadius: "1rem",
        padding: "1rem",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        backgroundColor: "white",
      }}
    >
      <form>
        <fieldset style={{ border: "none", padding: 0 }}>
          {/* Poll question */}
          <legend
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            {pollData.question}
          </legend>

          {/* Render poll options */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {pollData.options.map((opt) => {
              const isChecked = votedOptions.includes(opt.id);
              const isSelected = selected.includes(opt.id);
              const percent =
                totalVotes > 0
                  ? ((opt.votes / totalVotes) * 100).toFixed(1)
                  : 0;

              return (
                <div
                  key={opt.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    backgroundColor:
                      isChecked || isSelected ? "#dbeafe" : "white",
                  }}
                >
                  {/* Label with input and vote count */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      width: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type={multiSelect ? "checkbox" : "radio"}
                      checked={isChecked || isSelected}
                      onChange={() => handleSelect(opt.id)}
                      disabled={!!votedOptions.length}
                    />
                    <span style={{ flex: 1 }}>{opt.text}</span>
                    <span style={{ fontSize: "0.875rem", color: "#555" }}>
                      {opt.votes} votes ({percent}%)
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          {/* Buttons: Vote or Remove Vote */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            {!votedOptions.length && (
              <button
                onClick={handleVote}
                disabled={!selected.length || loading}
              >
                {loading ? "Submitting..." : "Vote"}
              </button>
            )}
            {votedOptions.length > 0 && (
              <button onClick={handleRemoveVote}>
                {loading ? "Removing..." : "Remove Vote"}
              </button>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default PollWidget;
