import React, { useState } from "react";
import "./styles.css";
const ITEMS = ["Item A", "Item B", "Item C"];
export default function TransferList() {
  const [availableItems, setAvailableItems] = useState(ITEMS);
  const [selectedItems, setSelectedItems] = useState([]);

  const [checked, setChecked] = useState({}); // object to track checked state of each item, keys are item name abd values are boolean
  const handleCheck = (item) => {
    setChecked((prev) => ({
      ...prev,
      [item]: !prev[item], // toggle the checked state for this item
    }));
  };
  const moveToSelected = () => {
    const toMove = availableItems.filter((item) => checked[item]); // get checked items
    setSelectedItems((prev) => [...prev, ...toMove]); // add to selected items
    setAvailableItems((prev) => prev.filter((item) => !checked[item])); // remove from available
    resetChecked(toMove); // reset checked state for moved items
  };
  const moveToAvailable = () => {
    const toMove = selectedItems.filter((item) => checked[item]);
    setAvailableItems((prev) => [...prev, ...toMove]);
    setSelectedItems((prev) => prev.filter((item) => !checked[item]));
    resetChecked(toMove);
  };
  const resetChecked = (items) => {
    setChecked((prev) => {
      const newChecked = { ...prev };
      items.forEach((item) => {
        delete newChecked[item]; // remove checked state for the moved items
      });
      return newChecked;
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div>
        <h1>Available</h1>
        {availableItems.map((itm, i) => (
          <div key={i}>
            <input
              type="checkbox"
              id={itm}
              checked={checked[itm] || false}
              onChange={() => handleCheck(itm)}
            />
            <label htmlFor={itm}>{itm}</label>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={moveToSelected}>→</button>
        <button onClick={moveToAvailable}>←</button>
      </div>
      <div>
        <h1>Selected</h1>
        {selectedItems.map((itm, i) => (
          <div key={i}>
            <input
              type="checkbox"
              id={itm}
              checked={checked[itm] || false}
              onChange={() => handleCheck(itm)}
            />
            <label htmlFor={itm}>{itm}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
