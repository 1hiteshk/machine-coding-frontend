import React, { useState } from "react";

function AgeCalculator() {
  const [date, setDate] = useState(null);
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  const handleAge = () => {
    const currentDate = new Date();
    const birth = new Date(date);
    if (birth > currentDate)
      return setError("Birthdate cannot be in the future"), setAge(null);
    if (!date) {
      setError("Please select a date");
      setAge(null);
      return;
    }
    let day = currentDate.getDate() - birth.getDate();
    let month = currentDate.getMonth() - birth.getMonth();
    let year = currentDate.getFullYear() - birth.getFullYear();
    if (day < 0)
      day += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    // This gets the number of days in *previous* month
    if (month < 0) (month += 12), year--;
    //     When the current month is less than the birth month, you haven't completed a full year yet — so:
    // Subtract 1 from the years.
    //       Add 12 to months to normalize the negative value.

    setAge(`${year} years, ${month} months, ${day} days`);
    setError("");
  };

  return (
    <div className="conatiner">
      <h2 className="title"></h2>
      <label
        className="label"
        data-testid="label-birthdate"
        htmlFor="birthdate"
      >
        Enter/Select a birthdate:
      </label>
      <input
        id="birthdate"
        type="date"
        className="input-date"
        data-testid="input-birthdate"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        className="btn-calc"
        data-testid="btn-calculate"
        onClick={handleAge}
      >
        Calculate Age
      </button>
      {error && (
        <p data-testid={"error-msg"} className="error-msg">
          {error}
        </p>
      )}
      {age && !error && (
        <p data-testid="age-result" className="age-result">
          {age}
        </p>
      )}
    </div>
  );
}

export default AgeCalculator;
