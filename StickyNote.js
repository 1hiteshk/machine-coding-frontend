import React, { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import "./styles.css";
// Predefined set of note background colors
const COLORS = [
  "#FFFA65",
  "#FF9AA2",
  "#FFB7B2",
  "#FFDAC1",
  "#E2F0CB",
  "#B5EAD7",
  "#C7CEEA",
];
// Note layout constants
const NOTE_WIDTH = 200;
const NOTE_HEIGHT = 150;
const GAP = 15;
const COLUMNS = 3;
// Random color selector
function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// position newly added notes in a neat grid layout
function getGridPosition(index) {
  const col = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  return {
    x: col * (NOTE_WIDTH + GAP),
    y: row * (NOTE_HEIGHT + GAP),
  };
}

function StickyNote() {
  const [notes, setNotes] = useState([]); // Stores all sticky notes
  const containerRef = useRef(null); // Ref to container div

   // Add a new note at the first free grid position
  const addNote = () => {
    // find free position
    // generate unique id and color
    // add to notes state

    const occupiedPosition = new Set(
      notes.map((note) => `${note.position.x},${note.position.y}`)
    );
    let index = 0;
    let position = null;

    // Find the first unoccupied grid cell
    while (true) {
      const pos = getGridPosition(index);
      const key = `${pos.x},${pos.y}`;
      if (!occupiedPosition.has(key)) {
        position = pos;
        break;
      }
      index++;
    }

    const id = Date.now();
    const newNote = {
      id,
      text: "",
      color: getRandomColor(),
      position,
      isDragging: false,
      offset: { x: 0, y: 0 },
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const removeNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const updateText = (id, text) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, text } : note))
    );
  };

      // Begin dragging a note
  const onMouseDown = (e, id) => {
    // calculate offset and mark note as dragging
    e.preventDefault();
    const containerRect = containerRef.current.getBoundingClientRect();
    const note = notes.find((note) => note.id === id);
    if (!note) return;
    // bring note to front on mouse down
    bringNoteToFront(id);

    const offsetX = e.clientX - containerRect.left - note.position.x;
    const offsetY = e.clientY - containerRect.top - note.position.y;

    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, isDragging: true, offset: { x: offsetX, y: offsetY } }
          : n
      )
    );
  };

   // Update position while dragging
  const onMouseMove = (e) => {
    // update position of dragging note(s)
    if (notes.every((note) => !note.isDragging)) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    setNotes((prev) =>
      prev.map((note) => {
        if (!note.isDragging) return note;
        let x = e.clientX - containerRect.left - note.offset.x;
        let y = e.clientY - containerRect.top - note.offset.y;

        const maxX = containerRect.width - NOTE_WIDTH;
        const maxY = containerRect.height - NOTE_HEIGHT;
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        return { ...note, position: { x, y } };
      })
    );
  };

   // Stop dragging when mouse is released or leaves container
  const onMouseUp = () => {
    // set isDragging false for all notes
    setNotes((prev) =>
      prev.map((note) =>
        note.isDragging ? { ...note, isDragging: false } : note
      )
    );
  };

   // Bring selected note to front (last in array -> higher zIndex)
  const bringNoteToFront = (id) => {
    setNotes((prevNotes) => {
      const note = prevNotes.find((n) => n.id === id);
      const others = prevNotes.filter((n) => n.id !== id);
      return [...others, note];
      // here the catch is index we putting the note which is clicked on last in array so its index inc. so the z-index therefore it is visible on top of all.
    });
  };

  // (scrollTop) scroll container to bottom automatically when new notes are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [notes.length]);

  // ensure notes stack visually with the last moved on top, use the note's index in the notes array plus one as zIndex style

  return (
    <div
      ref={containerRef}
      data-testid="sticky-notes-container"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="container"
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height:
            notes.length === 0
              ? "100%"
              : Math.max(
                  ...notes.map((note) => note.position.y + NOTE_HEIGHT)
                ) + 30,
        }}
      >
        {notes.map(({ id, text, color, position, isDragging }, index) => (
          <div
            key={id}
            data-testid="sticky-note"
            style={{
              // set zIndex based on order in notes array
              zIndex: index + 1,
              backgroundColor: color,
              left: position.x,
              top: position.y,
              position: "absolute",
              cursor: "grab",
              userSelect: "none",
            }}
            className="note"
            onMouseDown={(e) => onMouseDown(e, id)}
          >
            <button
              title={"Close"}
              data-testid="close-button"
              onClick={(e) => {
                e.stopPropagation();
                removeNote(id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="close-btn"
            >
              <X data-testid="icon-close" size={16} className="icon-close" />
            </button>
            <textarea
              data-testid="note-textarea"
              onChange={(e) => updateText(id, e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Enter Text"
              className="note-textarea"
            />
          </div>
        ))}
      </div>

      <button
        data-testid="add-note-button"
        className="add-note-btn"
        onClick={addNote}
        title="Add New Note"
        style={{ zIndex: 1000 }}
      >
        <Plus size={20} data-testid="icon-add" className="icon-add" />
      </button>
    </div>
  );
}

export default StickyNote;
