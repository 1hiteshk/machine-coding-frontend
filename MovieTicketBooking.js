/* 
🧩 Block 1: Seat (One chair)
<Seat />
Each little square you see is made with this.

It changes color depending on:

White = free seat

Green = seat you picked

Grey = already booked

If you click it, it tells the app: “I want this seat!”

🧩 Block 2: Modal (Pop-up box)
<Modal />
After you choose some seats, a box pops up:

Shows which seats you chose

Shows how much it costs 💰

Has 2 buttons:

Pay to keep the seats

Cancel to give them back

🧩 Block 3: MovieSeatBooking (The Boss)
This is the main controller of everything.

It does:

🎲 Makes a random seat map

Some seats already taken

Some are just holes (no seat)

🎯 Listens for your clicks

🧠 Remembers your chosen seats

💳 Shows the pop-up when you click “Book”

✅ Blocks seats when you “Pay”

❌ Unselects them when you “Cancel”

🧠 How does it remember things?
It uses “memory” called useState:

layout = the seating map (like a 2D LEGO board)

selected = which seats YOU picked

showModal = if the pop-up box should show

🖱️ When you click a seat:
It checks:

Is the seat already booked? ❌ Don’t do anything

Is it empty? ✅ Mark it green and remember it

Is it already green? ➖ Unmark it

It updates the seating chart (like drawing new colors)

It updates the list of seats you picked

🧾 When you click the “Book” button:
It opens a pop-up box 🧃

You see which seats you picked and the total price

If you press Pay:

Those seats turn grey and are now taken!

If you press Cancel:

The green seats go back to white (like you never clicked)

🎉 That’s It!
You can now:

Click seats to choose them

Book and pay (pretend money)

See your seat map like in a real movie website
*/
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <MovieSeatBooking />
    </div>
  );
}

// Configuration for rows with label and seat count
const ROWS = [
  { label: "A", count: 18 },
  { label: "B", count: 18 },
  { label: "C", count: 18 },
  { label: "D", count: 18 },
  { label: "E", count: 22 },
  { label: "F", count: 22 },
  { label: "G", count: 22 },
  { label: "H", count: 22 },
  { label: "I", count: 22 },
  { label: "J", count: 22 },
  { label: "K", count: 22 },
  { label: "L", count: 22 },
  { label: "M", count: 22 },
  { label: "N", count: 22 },
  { label: "O", count: 22 },
  { label: "P", count: 22 },
];

// Enum for seat statuses
const STATUS = {
  AVAILABLE: "AVAILABLE",
  SELECTED: "SELECTED",
  BLOCKED: "BLOCKED",
  NO_SEAT: "NO_SEAT",
};

const PRICE = 800; // Ticket price per seat

// Single seat component with inline styles and click handling
function Seat({ status, onClick }) {
  let style = {
    width: 24,
    height: 24,
    border: "1px solid #ccc",
    cursor: "pointer",
    margin: 2,
    background: "white",
  };

  // Style based on seat status
  if (status === STATUS.BLOCKED) {
    style.background = "grey";
    style.pointerEvents = "none";
  } else if (status === STATUS.SELECTED) {
    style.background = "green";
  } else if (status === STATUS.NO_SEAT) {
    style.visibility = "hidden";
  }

  return <div style={style} onClick={onClick}></div>;
}

// Modal for booking confirmation with selected seats and total price
function Modal({ onClose, selectedSeats, onConfirm }) {
  const total = selectedSeats.length * PRICE;
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 6,
          maxWidth: 300,
          width: "100%",
        }}
      >
        <h3>Confirm Booking</h3>
        <p>Seats: {selectedSeats.join(", ")}</p>
        <p>Total: Rs. {total}</p>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button onClick={() => onConfirm()}>Pay Rs. {total}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function MovieSeatBooking() {
  // Seat layout initialized with random blocked and no-seat positions
  const [layout, setLayout] = useState(() => {
    return ROWS.map(({ label, count }) =>
      Array.from({ length: count }).map((_, i) => {
        const blocked = Math.random() < 0.1;
        const noSeat = Math.random() < 0.05;
        if (noSeat) return STATUS.NO_SEAT;
        return blocked ? STATUS.BLOCKED : STATUS.AVAILABLE;
      })
    );
  });

  const [selected, setSelected] = useState([]); // User-selected seat IDs
  const [showModal, setShowModal] = useState(false); // Show/hide modal

  // Toggle selection for a seat
  const toggleSelect = (rowIdx, colIdx) => {
    const seatId = `${ROWS[rowIdx].label}${colIdx + 1}`;
    const current = layout[rowIdx][colIdx];

    if (current === STATUS.BLOCKED || current === STATUS.NO_SEAT) return;

    // Update seat layout
    const updatedLayout = layout.map((row, rIdx) =>
      row.map((seat, cIdx) => {
        if (rIdx === rowIdx && cIdx === colIdx) {
          return current === STATUS.AVAILABLE
            ? STATUS.SELECTED
            : STATUS.AVAILABLE;
        }
        return seat;
      })
    );
    setLayout(updatedLayout);

    // Update selected seat list
    setSelected((prev) => {
      if (current === STATUS.AVAILABLE) {
        return [...prev, seatId];
      } else if (current === STATUS.SELECTED) {
        return prev.filter((s) => s !== seatId);
      }
      return prev;
    });
  };

  // Confirm booking - mark selected as blocked
  const confirmBooking = () => {
    setLayout((prev) => {
      const updated = prev.map((row) =>
        row.map((seat) => (seat === STATUS.SELECTED ? STATUS.BLOCKED : seat))
      );
      return updated;
    });
    setSelected([]);
    setShowModal(false);
  };

  // Cancel modal - revert selected seats to available
  const cancelBooking = () => {
    setLayout((prev) => {
      const updated = prev.map((row) =>
        row.map((seat) => (seat === STATUS.SELECTED ? STATUS.AVAILABLE : seat))
      );
      return updated;
    });
    setSelected([]);
    setShowModal(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Dynamic Movie Seat Layout</h1>

      {/* Screen label */}
      <div
        style={{
          background: "#eee",
          padding: 8,
          marginBottom: 10,
          borderRadius: 4,
        }}
      >
        All eyes this way please!
      </div>

      {/* Seat grid layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          margin: "20px auto",
          width: "fit-content",
        }}
      >
        {layout.map((row, rowIdx) => (
          <div
            key={ROWS[rowIdx].label}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <span style={{ width: 20, textAlign: "right", marginRight: 4 }}>
              {ROWS[rowIdx].label}
            </span>
            {row.map((seat, colIdx) => (
              <Seat
                key={colIdx}
                status={seat}
                onClick={() => toggleSelect(rowIdx, colIdx)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Booking button */}
      {selected.length > 0 && (
        <button
          style={{
            marginTop: 10,
            padding: "8px 16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={() => setShowModal(true)}
        >
          Book ({selected.length}) Seat(s)
        </button>
      )}

      {/* Modal popup */}
      {showModal && (
        <Modal
          selectedSeats={selected}
          onClose={cancelBooking}
          onConfirm={confirmBooking}
        />
      )}
    </div>
  );
}

/* 
Let's go step-by-step to understand the complete flow and how components work in this dynamic movie ticket booking app:

🧠 1. Constants & Configurations
ROWS: Array of 16 rows labeled A–P, each with a seat count (count).

STATUS: Enum to describe seat states:

AVAILABLE: User can click.

SELECTED: Clicked by user.

BLOCKED: Already booked, not clickable.

NO_SEAT: Gaps/no seats for empty layout blocks.

PRICE: Static ticket price (₹800).

🧱 2. Seat Component
function Seat({ status, onClick })
Renders one <div> for a seat with inline style.

Color logic:

White = available

Green = selected

Grey = blocked

Hidden = no seat

Calls onClick() on click unless blocked or hidden.

💬 3. Modal Component
function Modal({ selectedSeats, onClose, onConfirm })
Displays selected seats and total ₹.

Two buttons:

✅ Pay → triggers onConfirm().

❌ Cancel → triggers onClose().

It uses createPortal to render above everything (like modals usually do).

🎯 4. Main Component: MovieSeatBooking
💡 State Definitions:
const [layout, setLayout] = useState(() => {...})
Generates seat map initially with:

~10% seats blocked.

~5% no seats (gaps).

jsx
Copy
Edit
const [selected, setSelected] = useState([]);
const [showModal, setShowModal] = useState(false);
selected: holds selected seat labels (e.g., ['A2', 'A3']).

showModal: controls modal visibility.

🎯 5. Main Logic: toggleSelect()
const toggleSelect = (rowIdx, colIdx) => {...}
Gets current seat status.

If not blocked or hidden:

Toggles seat between AVAILABLE ↔ SELECTED.

Updates layout and selected list.

💳 6. Booking Logic
✅ Confirm Booking
const confirmBooking = () => {...}
Converts all SELECTED seats to BLOCKED.

Clears modal and selection.

❌ Cancel Booking
const cancelBooking = () => {...}
Converts SELECTED seats back to AVAILABLE.

Clears modal and selection.

🖥️ 7. Render Flow (JSX)
Renders layout using nested .map():

Outer: rows

Inner: seats per row

Renders Seat component with correct props.

Shows booking button only if any seats selected.

Opens modal on click of booking button.

🔁 User Flow Summary
Page renders seat map with random blocked/gaps.

User clicks seat → it's added to selection.

Click booking button → modal pops up.

Confirm → seats become blocked.

Cancel → seats are released.
*/
