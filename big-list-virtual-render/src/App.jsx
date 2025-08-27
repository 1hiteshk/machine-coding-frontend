/* Pseudocode of the logic:
Initialize:
TOTAL_ITEMS = 1000
Each item has fixed HEIGHT = 50px
Visible viewport is 10 * HEIGHT = 500px
Track scroll position using useRef and useState.

Calculate:
startIndex = first visible item index
endIndex = last visible item index
Add vertical padding (top and bottom) to mimic height of offscreen items
Render only the visible items in the viewport. */

// React hooks for state and refs
import { useState, useRef } from "react";
// CSS styles for the app
import "./App.css";

// Total number of items to render
const TOTAL_ITEMS = 1000;
// Height of each item in pixels
const HEIGHT = 50;

// Generate an array of 1000 items: [" Item-0", " Item-1", ..., " Item-999"]
const items = Array.from({ length: TOTAL_ITEMS }).map((_, i) => ` Item-${i}`);

export default function App() {
  // Track vertical scroll position
  const [scrolled, setScrolled] = useState(0);
  // Ref to access the scrollable container DOM node
  const containerRef = useRef(null);

  // Calculate the first and last item index that should be visible
  const startIndex = Math.floor(scrolled / HEIGHT);
  const endIndex = startIndex + 10;

  // Slice the visible items from the list
  const visibleItems = items.slice(startIndex, endIndex);

  // Calculate how much empty space (padding) is needed above and below the visible items
  const paddingTop = startIndex * HEIGHT;
  const paddingBottom = (TOTAL_ITEMS - endIndex) * HEIGHT;

  // Handle scroll event to update scroll position
  const handleScroll = () => {
    if (containerRef.current) {
      // Update scroll offset from top
      setScrolled(containerRef.current.scrollTop);
    }
  };

  // Log current scroll offset (optional debugging)
  console.log({HEIGHT,scrolled,startIndex,paddingTop, endIndex, paddingBottom,visibleItems});

  return (
    // Scrollable container
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        border: "1px solid grey",
        height: HEIGHT * 10, // 10 visible items at a time
        overflow: "auto", // enable scrolling
        width: "300px", // fixed width for the container
      }}
    >
      <div
        style={{
          paddingTop: paddingTop,     // top space simulates offscreen items
          paddingBottom: paddingBottom, // bottom space simulates offscreen items
        }}
      >
        {/* Render only the visible items */}
        {visibleItems.map((item) => (
          <div
            key={item}
            style={{
              height: HEIGHT,
              border: "1px solid red",
              boxSizing: "border-box",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
/* 
You have 1,000 red boxes stacked on top of each other, like a super long tower.
But your computer can only see 10 boxes at a time, through a window (the scroll area).
Instead of drawing all 1,000 boxes:
We only draw 10 boxes (the ones in the window).
We add empty space (paddingTop) above those boxes — so it feels like there are boxes above.
We add empty space (paddingBottom) below the boxes — so it feels like there are boxes below.
When you scroll, we change which 10 boxes are showing.

Think of a fake tall book with only 10 real pages. But:
You glue together 990 empty pages before the first one (paddingTop).
Then glue 990 empty pages after the last one (paddingBottom).
So when you flip through, it feels like a huge 1,000-page book — but you only see 10 real pages at any time!
That’s how padding and scroll trick your eyes — it’s virtual scrolling: faking the full list using just part of it. */