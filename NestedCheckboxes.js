import { useState } from "react";

// Sample nested checkbox data
const CheckboxesData = [
  {
    id: 1,
    label: "Fruits",
    children: [
      { id: 2, label: "Apple" },
      { id: 3, label: "Banana" },
      {
        id: 4,
        label: "Citrus",
        children: [
          { id: 5, label: "Orange" },
          { id: 6, label: "Lemon" },
        ],
      },
    ],
  },
  {
    id: 7,
    label: "Vegetables",
    children: [
      { id: 8, label: "Carrot" },
      { id: 9, label: "Broccoli" },
    ],
  },
];

const Checkboxes = ({ data, checked, setChecked }) => {
  const handleChange = (isChecked, node) => {
    setChecked((prev) => {
      const newState = { ...prev, [node.id]: isChecked }; // update current node
      // if children are present , add all of them to new state

      // Top-down: check/uncheck all children recursively
      const updateChildren = (n) => {
        if (n.children) {
          n.children.forEach((child) => {
            newState[child.id] = isChecked; // apply to child
            updateChildren(child); // apply to child's children
          });
        }
      };

      // if all children are checked , mark the parent as checked
      // whenever onchange event happens, any item is checked , check on all my tree
      // for all the nodes in original data this will basically verify check for that particular node

      // Bottom-up: update parents if all children are checked
      const updateParents = (currentNode, tree) => {
        const findParent = (nodeId, currentTree) => {
          for (const item of currentTree) {
            if (item.children?.some((child) => child.id === nodeId)) {
              return item; // parent found
            }
            const found = item.children && findParent(nodeId, item.children);
            if (found) return found; // look deeper
          }
          return null; // no parent found
        };

        // Start walking up from current node
        let parent = findParent(currentNode.id, CheckboxesData);
        while (parent) {
          // check if all children are selected
          const allChildrenChecked = parent.children.every(
            (child) => newState[child.id]
          );
          newState[parent.id] = allChildrenChecked; // update parent
          parent = findParent(parent.id, CheckboxesData); // go up further
        }
      };

      updateChildren(node); // apply down
      updateParents(node, CheckboxesData); // apply up

      return newState;
    });
  };

  return (
    <div>
      {data.map((node) => (
        <div key={node.id} style={{ paddingLeft: "20px" }}>
          <input
            type="checkbox"
            checked={checked[node.id] || false} // fallback to false
            onChange={(e) => handleChange(e.target.checked, node)}
          />
          <span>{node.label}</span>
          {node.children && (
            <Checkboxes
              data={node.children}
              checked={checked}
              setChecked={setChecked}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function NestedCheckbox() {
  const [checked, setChecked] = useState({}); // holds checkbox state by ID

  return (
    <div>
      <h2>Nested Checkbox</h2>
      <Checkboxes
        data={CheckboxesData}
        checked={checked}
        setChecked={setChecked}
      />
    </div>
  );
}
