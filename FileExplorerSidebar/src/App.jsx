import { useState } from "react";
import "./App.css";
import json from "./data.json";
// nested file folder structure
// expand and collapse folders
// add / remove files and folders

// to render list of objects recursively
const List = ({ list, addNodeToList, deleteNodeFromList }) => {
  const [isExpanded, setIsExpanded] = useState({ 6: true });
  return (
    <div className="container">
      {list.map((node, i) => (
        <div key={node.id || i}>
          <div className="box">
            {node.isFolder ? (
              <span
                className="toggle"
                onClick={() =>
                  setIsExpanded((prev) => ({
                    ...prev,
                    [node.id]: !prev[node.id] // toggle the expanded state of the folder,
                    // here we use node.id as key to track the expanded state
                    // this allows us to expand/collapse individual folders
                    // if we use node.name, it will not work as expected
                    // because node.name is not unique, it can be same for multiple nodes
                    // so we use node.id which is unique for each node
                  }))
                }
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {isExpanded?.[node.id] ? "∨ " : "> "}
              </span>
            ) : (
              <span style={{ paddingLeft: "14px" }}></span>
            )}
            <span>
              {node.isFolder ? "📁 " : "📄 "}
              {node.name}
            </span>
            {node.isFolder && (
              <span title="Add">
                <img
                  height={18}
                  width={18}
                  className="icon"
                  src="https://cdn-icons-png.flaticon.com/512/1091/1091916.png"
                  onClick={() => addNodeToList(node.id, false)}
                  alt="Add File"
                />

                <img
                  height={18}
                  width={18}
                  className="icon"
                  src="https://cdn-icons-png.flaticon.com/512/6899/6899250.png"
                  onClick={() => addNodeToList(node.id, true)}
                  alt="Add Folder"
                />
              </span>
            )}
            <span title="Delete">
              <img
                height={16}
                width={16}
                className="icon"
                src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
                alt="Delete"
                onClick={() => deleteNodeFromList(node.id)}
              />
            </span>
          </div>
          {/* If the node is expanded and has children, render the List component recursively */}
          {/* This allows for nested folders to be displayed */}
          {isExpanded?.[node.id] && node?.children && (
            <List
              list={node.children}
              addNodeToList={addNodeToList}
              deleteNodeFromList={deleteNodeFromList}
            />
          )}
        </div>
      ))}
    </div>
  );
};

function App() {
  const [data, setData] = useState(json);
  const addNodeToList = (parentId, isFolder) => {
    const name = prompt("Enter the name of the new folder");
    // we will have to loop through the whole data to find the parent id node and push a new node object to its children
    // tree traversal like BFS or DFS
    const updateTree = (list) => {
      return list.map((node) => {
        if (node.id === parentId) {
          // if the node is the parent node, we will add a new node to its children
          return {
            ...node,
            children: [
              ...node.children,
              {
                id: Date.now().toString(), // unique id for the new node
                name: name, // default name for the new node
                isFolder: isFolder, // new node is a folder or file
                // if the new node is a folder, it will have children, otherwise it will not
                children: isFolder ? [] : undefined, // if it is a folder, it will have children, otherwise it will not
              },
            ],
          };
        }
        // if the node is not the parent node, we will traverse its children ,handling recursion
        if (node.children) {
          return {
            ...node,
            children: updateTree(node.children), // recursively call updateTree on the children
          };
        }
        // if the node has no children, we will return the node as it is
        return node; // it is DFS
      });
    };
    // update Tree function will traverse the tree and add a new node to the children of the parent node
    setData((prev) => updateTree(prev));
  };

  const deleteNodeFromList = (id) => {
    // we will have to loop through the whole data to find the node with the given id
    const updateTree = (list) => {
      // .map cause for handling recursion and its children
      // .filter is used to remove the node with the given id
      return list
        .filter((node) => node.id !== id)
        .map((node) => {
          // if the node has children, we will traverse its children
          if (node.children) {
            return {
              ...node,
              children: updateTree(node.children), // recursively call updateTree on the children
            };
          }
          // if the node has no children, we will return the node as it is
          return node; // it is DFS
        });
    };
    setData((prev) => updateTree(prev));
    // we will have to traverse the tree and remove the node with the given id
  };

  return (
    <div>
      <h1>File Explorer</h1>
      <List
        list={data}
        addNodeToList={addNodeToList}
        deleteNodeFromList={deleteNodeFromList}
      />
    </div>
  );
}

export default App;
