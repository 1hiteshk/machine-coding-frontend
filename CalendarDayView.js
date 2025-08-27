/* 
✅ Step-by-Step Flow (Mental Model to Rebuild It Anytime)
1. Setup Constants

HOURS: array from 0 to 23 → represents 24 hourly blocks.
TIME_BLOCK_HEIGHT = 60: height for each hour block = 60px.
EVENT_COLORS: array of colors to alternate event styling.

2. Define Utility Functions
🔹 pad(n)
Adds a 0 in front of 1-digit numbers → ensures 03:00 not 3:00.

🔹 formatTime(date)
Converts a Date object into HH:MM format string.

🔹 addMinutes(date, minutes)
Adds X minutes to a date → helps in calculating event end time.

🔹 getPositionStyle(start, end)
Takes event's start and end Date objects.

Returns { top, height } in px for CSS positioning.

🔹 doEventsOverlap(a, b)
Checks if two events overlap by comparing their time ranges.

3. React Component: CalendarDayView
This is the main component that renders the UI and handles logic.

4. State

const [events, setEvents] = useState([]);
Keeps track of all added events.

5. Functions to Add Events
🔹 handleAddEvent(hour)
Triggered when user clicks a time block.

Prompts:

For event title
For duration (in minutes)

Calculates:

Start time = today @ clicked hour
End time = start + duration

Pushes new event to state.

🔹 handleAddEventManual()
Triggered by the floating + button.

Prompts:

title
start time (HH:MM)
end time (HH:MM)

Parses strings to Date

Adds to state if valid

6. Sort Events

const sortedEvents = [...events].sort((a, b) => a.start - b.start);
Sorts by start time to render from earliest to latest.

7. Handle Overlapping

const layoutedEvents = sortedEvents.map(...)
For each event:

Count how many it overlaps with (overlapCount)

Its position index among overlapping ones (indexInOverlap)

Needed to render overlapping events side-by-side.

8. Render UI
📅 Time Labels
Left column renders 00:00 to 23:00.

🕘 Time Blocks
Right column renders 24 hourly blocks.

onClick={() => handleAddEvent(h)} to trigger add event.

📌 Event Blocks
Loops over layoutedEvents

Uses getPositionStyle() to position events in correct place on screen.

Uses overlapCount and indexInOverlap to determine width & left position.

➕ Floating Add Button
At bottom-right corner

Calls handleAddEventManual() for manual time inputs

🧠 What You Need to Memorize
Structure:

Constants → Utilities → State → Handlers → Layout logic → Render JSX

Main logic:

click → get time → calculate start/end → save to state → re-render

Rendering logic:

Loop through hours

Loop through events

Calculate position

Render */

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <CalendarDayView />
    </div>
  );
}
import React, { useState } from "react";

// Generate an array of 24 hours (0 to 23)
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TIME_BLOCK_HEIGHT = 60; // Height of each hour block in pixels
const EVENT_COLORS = ["#93c5fd", "#86efac", "#fde68a", "#f9a8d4"]; // Color options for events

// Pad single digit numbers with leading zero
function pad(n) {
  return n < 10 ? "0" + n : n;
}

// Format date object to HH:MM
function formatTime(date) {
  return pad(date.getHours()) + ":" + pad(date.getMinutes());
}

// Add minutes to a given date
function addMinutes(date, minutes) {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}

// This function calculates the visual position (top) and height of an event block based on start/end time. You could extract minute conversion logic for reuse.
// Calculate top offset and height for an event based on time
function getPositionStyle(start, end) {
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  const top = (startMinutes / 60) * TIME_BLOCK_HEIGHT;
  const height = Math.max(
    ((endMinutes - startMinutes) / 60) * TIME_BLOCK_HEIGHT,
    1
  );
  return { top, height };
}

// Check if two events overlap
function doEventsOverlap(a, b) {
  return a.start < b.end && b.start < a.end;
}

function CalendarDayView() {
  const [events, setEvents] = useState([]); // State to store list of events

  // Add event by clicking on an hour block
  const handleAddEvent = (hour) => {
    const title = prompt("Event title:");
    if (!title) return;

    const durationStr = prompt("Duration in minutes (e.g. 15, 30, 60):");
    const duration = parseInt(durationStr);
    if (isNaN(duration) || duration <= 0) return;

    const start = new Date();
    start.setHours(hour, 0, 0, 0);
    const end = addMinutes(start, duration);

    const newEvent = { start, end, title };
    setEvents([...events, newEvent]);
  };

  // Add event manually using HH:MM time strings
  const handleAddEventManual = () => {
    const title = prompt("Event title:");
    if (!title) return;

    const startStr = prompt("Start time (HH:MM):");
    const endStr = prompt("End time (HH:MM):");

    if (!/^\d{2}:\d{2}$/.test(startStr) || !/^\d{2}:\d{2}$/.test(endStr))
      return;

    const [startHour, startMinute] = startStr.split(":").map(Number);
    const [endHour, endMinute] = endStr.split(":").map(Number);

    const start = new Date();
    const end = new Date();
    start.setHours(startHour, startMinute, 0, 0);
    end.setHours(endHour, endMinute, 0, 0);

    if (end <= start) return;

    const newEvent = { start, end, title };
    setEvents([...events, newEvent]);
  };

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => a.start - b.start);

  // This loop adds overlap tracking to each event to support side-by-side rendering. Might benefit from clearer naming like positionedEvents.
  // Determine overlapping layout for each event
  const layoutedEvents = sortedEvents.map((event, i, all) => {
    let overlapCount = 1;
    let indexInOverlap = 0;

    for (let j = 0; j < all.length; j++) {
      if (i === j) continue;
      if (doEventsOverlap(event, all[j])) {
        overlapCount++;
        if (j < i) indexInOverlap++;
      }
    }

    return { ...event, overlapCount, indexInOverlap };
  });

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        height: `${HOURS.length * TIME_BLOCK_HEIGHT}px`,
        width: "100%",
      }}
    >
      {/* Sidebar showing hour labels */}
      <div
        style={{
          width: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          paddingRight: "8px",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        {HOURS.map((h) => (
          <div
            key={h}
            style={{
              height: `${TIME_BLOCK_HEIGHT}px`,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            {pad(h)}:00
          </div>
        ))}
      </div>

      {/* Main calendar grid */}
      <div
        style={{
          flex: 1,
          position: "relative",
          borderLeft: "1px solid #e5e7eb",
        }}
      >
        {/* Hour blocks for interaction */}
        {HOURS.map((h) => (
          <div
            key={h}
            style={{
              borderTop: "1px solid #e5e7eb",
              height: `${TIME_BLOCK_HEIGHT}px`,
              cursor: "pointer",
            }}
            onClick={() => handleAddEvent(h)}
          ></div>
        ))}

        {/* Render events with position and size based on time */}
        {layoutedEvents.map((event, idx) => {
          const { top, height } = getPositionStyle(event.start, event.end);
          const width = 100 / event.overlapCount;
          const left = width * event.indexInOverlap;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: `${top}px`,
                left: `${left}%`,
                width: `${width}%`,
                height: `${height}px`,
                padding: "4px",
                fontSize: "12px",
                color: "#ffffff",
                borderRadius: "4px",
                backgroundColor: EVENT_COLORS[idx % EVENT_COLORS.length],
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <strong>{event.title}</strong>
              <div>
                {formatTime(event.start)} - {formatTime(event.end)}
              </div>
            </div>
          );
        })}

        {/* Floating button to manually add event */}
        <button
          onClick={handleAddEventManual}
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            padding: "8px 12px",
            borderRadius: "50%",
            fontSize: "24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
