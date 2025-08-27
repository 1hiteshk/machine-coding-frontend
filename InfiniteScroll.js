import { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <InfiniteScrollProducts />
    </div>
  );
}

const LIMIT = 10;
function InfiniteScrollProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);
  const loaderRef = useRef(null);  // for IntersectionObserver

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * LIMIT;
      const response = await fetch(
        `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`
      );
      const data = await response.json();

      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.products.length === LIMIT);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

/*   useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, loading]); */
 
/*   useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
      });

    const target = loaderRef.current; //Starts observing the DOM node.
    if (target) observer.observe(target); //This node (<div ref={loaderRef}>) is usually placed at the bottom of your list.

    return () => { // This removes the observer when:
      if (target) observer.unobserve(target);
    }; // The component unmounts,useEffect dependencies change.
  }, [hasMore, loading]); */
 
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Products
      </h1>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: "600px",
          overflowY: "auto",
          border: "2px solid #ddd",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{
                  height: "160px",
                  objectFit: "contain",
                  margin: "0 auto 0.5rem",
                  display: "block",
                }}
              />
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.title}
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#666" }}>
                ${product.price}
              </p>
            </div>
          ))}
        </div>
        <div ref={loaderRef} style={{ height: '40px', textAlign: 'center', padding: '1rem' }}>
          {loading && <span style={{ color: '#888' }}>Loading...</span>}
        </div>
         {!hasMore && <div>No more products to fetch</div>}
      </div>
    </div>
  );
}

// Without hasMore, page keeps increasing, and the app will keep firing fetch() even though the server has no more data, wasting bandwidth.
// Once the API returns fewer than LIMIT items, we know we’re at the end. Setting hasMore = false stops further page increments.
// document
// It represents the entire HTML document loaded in the browser.

// Think of it like the root object for everything on the page.

// document.documentElement
// It specifically refers to the root <html> element of the document.

// In the DOM tree, this is the top-level element that contains both <head> and <body>.
// | Property       | Meaning                                                               |
// | -------------- | --------------------------------------------------------------------- |
// | `scrollTop`    | **How far the user has scrolled** from the top (in pixels)            |
// | `clientHeight` | The **visible height** of the element (e.g. 600px container height)   |
// | `scrollHeight` | The **total height of the content** inside (includes hidden overflow) |
// Imagine:

// clientHeight = 600 → the container box

// scrollHeight = 1200 → content inside is longer than box

// scrollTop = 600 → the user scrolled 600px down

// 🧠 Scroll Detection Logic
// We do:

// js
// Copy
// Edit
// if (scrollTop + clientHeight >= scrollHeight - 5)
//   This means:

// “If the bottom of the visible area is within 5px of the bottom of total content, then user is near the end.”

// ✅ So it's time to load more items!
/* 
🧠 What’s Happening Step-by-Step
Mount or Re-run Trigger:
This useEffect runs on component mount and whenever hasMore or loading changes.

What It Does:
It adds a scroll event listener to containerRef.current (your scrollable <div>).
That event listener does not depend on a React state change to be triggered — it’s a native browser event.

When the Scroll Happens:
When the user scrolls inside the container, the handleScroll() function runs.
Inside that function, it checks:
if (scrolled to bottom && not already loading && still has more)
If true, it increases the page state:

What Happens When page Changes:
The other useEffect() (that depends on [fetchProducts]) will detect the updated page, fetch new products, and update the UI.

That’s totally valid and more flexible in this context.
✅ 
Scroll events are fired by the browser, not React.

| Case                                              | Best Choice                        |
| ------------------------------------------------- | ---------------------------------- |
| Scroll inside a React element (`div`, `ul`, etc.) | ✅ `onScroll`                       |
| Scroll on entire page (`window`)                  | 🛠 `addEventListener` on `window`  |
| Complex listeners, needing `passive: true`        | 🛠 `addEventListener` with options |

📌 Final Verdict:
For scrolling inside components, use onScroll
For page-level scroll, use addEventListener(window, 'scroll') */

/* 
🔍 Line-by-Line Explanation:
✅ const observer = new IntersectionObserver(entries => { ... });
Creates a new observer that watches when an element (like loaderRef) enters the viewport of its scroll container.

The callback entries => {} is triggered whenever intersection changes (entering/leaving view).

✅ entries[0].isIntersecting
entries is an array of observed intersections (you can observe multiple elements).

entries[0] is the first (and only) target in this case.

.isIntersecting === true means it's currently visible (partially or fully) in the viewport.

✅ if (entries[0].isIntersecting && hasMore && !loading)
This ensures:

The loader div is visible.

We're not currently fetching.

There are more items to load.

✅ setPage(prev => prev + 1)
Increments the page number.

This triggers the fetchProducts() useEffect tied to [page].

Pros of IntersectionObserver
- Native, optimized for performance.
- Avoids manually checking scroll positions.
- Fires only when needed (when the element intersects).
*/