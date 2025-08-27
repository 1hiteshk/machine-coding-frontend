import React, { useState } from "react";

function TodoList() {
  const [input, setInput] = useState("");
  const [todoList, setTodoList] = useState([]);

  const handleAdd = () => {
    if (!input.trim()) return;
    const item = {
      id: todoList.length + 1,
      text: input.trim(),
      completed: false,
    };
    setTodoList((todoList) => [...todoList, item]);
    setInput("");
  };

  const deleteTodo = (id) => {
    setTodoList(todoList.filter((t) => t.id !== id));
  };

  const toggleCheck = (id) => {
    setTodoList(
      todoList.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            completed: !t.completed,
          };
        } else {
          return t;
        }
      })
    );
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        placeholder="Enter todo"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      <div>
        <ul>
          {todoList.map((t) => (
            <li key={t.id}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleCheck(t.id)}
              />
              <span
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                }}
              >
                {t.text}
              </span>
              <button onClick={() => deleteTodo(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
