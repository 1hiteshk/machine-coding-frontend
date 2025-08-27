import { useEffect, useState } from "react";
import "./styles.css";
import ProductCard from "./ProductCard.js";


const PAGE_SIZE = 10;

const Pagination = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const fetchData = async () => {
    const data = await fetch(`https://dummyjson.com/products?limit=500`);
    const json = await data.json();
    setProducts(json.products);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalProducts = products.length;
  const noOfPages = Math.ceil(totalProducts / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const handlePageChange = (n) => {
    setCurrentPage(n);
  };
  const gotoNext = () => {
    setCurrentPage((p) => p + 1);
  };
  const gotoPrev = () => {
    setCurrentPage((p) => p - 1);
  };

  return !products.length ? (
    <h1>No products found</h1>
  ) : (
    <div style={{ margin: "0 auto" }}>
      <h1>Pagination</h1>
      <button
        style={{
          padding: "2px 5px",
          margin: "2px",
          border: "1px solid black",
          cursor: "pointer",
        }}
        onClick={gotoPrev}
        disabled={currentPage === 0}
        id={"previous"}
      >
        prev
      </button>
      {[...Array(noOfPages).keys()].map((n) => (
        <span
          style={{
            padding: "2px 5px",
            margin: "2px",
            border: "1px solid black",
            cursor: "pointer",
            background: currentPage == n ? "grey" : "transparent",
          }}
          key={n}
          onClick={() => handlePageChange(n)}
        >
          {n + 1}
        </span>
      ))}
      <button
        style={{
          padding: "2px 5px",
          margin: "2px",
          border: "1px solid black",
          cursor: "pointer",
        }}
        onClick={gotoNext}
        disabled={currentPage === noOfPages - 1}
        id="next"
      >
        next
      </button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products.slice(start, end).map((product) => (
          <ProductCard
            key={product.id}
            image={product.thumbnail}
            title={product.title}
          />
        ))}
      </div>
    </div>
  );
};
export default Pagination;

export const ProductCard = ({ image, title }) => {
  return (
    <div
      style={{
        border: "1px solid black",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "5px auto",
        maxWidth: "60px",
      }}
    >
      <img style={{ height: "60px", width: "60px" }} src={image} alt={title} />
      <span style={{ textWrap: "wrap" }}>{title}</span>
    </div>
  );
};
