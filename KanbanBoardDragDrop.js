import React, { useRef, useState } from "react";
import "./styles.css";

// Sample initial data
const initialData = {
  todo: [
    { id: "task-1", label: "Task 1" },
    { id: "task-2", label: "Task 2" },
  ],
  "in progress": [{ id: "task-3", label: "Task 3" }],
  done: [{ id: "task-4", label: "Task 4" }],
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);
  const [draggedTask, setDraggedTask] = useState(null);
  // add a new task inline only in the 'to do' column
  const [isAddingNewTask, setIsAddingNewTask] = useState(false);
  const [newTaskInputLabel, setNewTaskInputLabel] = useState("");
  const enterPressedRef = useRef(false);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskLabel, setEditingTaskLabel] = useState("");

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = (columnId) => {
    if (!draggedTask) return;

    setColumns((prev) => {
      // remove task from old column
      const update = { ...prev };
      for (let col in update) {
        update[col] = update[col].filter((item) => item.id !== draggedTask.id);
      }
      // avoid moving to same column
      //  if (prev[columnId].find((item) => item.id === draggedTask.id)) return prev;

      // add to new column
      update[columnId] = [...update[columnId], draggedTask];
      return update;
    });

    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleLabelClick = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskLabel(task.label);
  };

  const saveEditedTask = (taskId) => {
    setColumns((prev) => {
      const updated = { ...prev };
      for (let col in updated) {
        updated[col] = updated[col].map((task) =>
          task.id === taskId ? { ...task, label: editingTaskLabel } : task
        );
      }
      return updated;
    });
    setEditingTaskId(null);
    setEditingTaskLabel("");
  };

  const handleEditKeyPress = (e, taskId) => {
    if (e.key === "Enter") {
      saveEditedTask(taskId);
    }
  };

  const deleteTask = (taskId) => {
    setColumns((prev) => {
      const updated = {};
      for (let col in prev) {
        updated[col] = prev[col].filter((task) => task.id !== taskId);
      }
      return updated;
    });
  };

  const addNewTaskInline = (columnId) => {
    if (enterPressedRef.current) {
      enterPressedRef.current = false;
      return;
    }

    if (newTaskInputLabel.trim() === "") {
      setIsAddingNewTask(false);
      setNewTaskInputLabel("");
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      label: newTaskInputLabel.trim(),
    };

    setColumns((prev) => ({
      ...prev,
      [columnId]: [...prev[columnId], newTask],
    }));

    setIsAddingNewTask(false);
    setNewTaskInputLabel("");
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Drag & Drop</h2>
      <div className="board">
        {["todo", "in progress", "done"].map((col) => (
          <div
            key={col}
            className="column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col)}
          >
            <h4>
              {col === "todo"
                ? "To Do"
                : col === "in progress"
                ? "In Progress"
                : "Done"}
            </h4>

            {columns[col].map((task) => (
              <div
                key={task.id}
                className="task"
                draggable
                onDragStart={() => handleDragStart(task)}
              >
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editingTaskLabel}
                    onChange={(e) => setEditingTaskLabel(e.target.value)}
                    onBlur={() => saveEditedTask(task.id)}
                    onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span onClick={() => handleLabelClick(task)}>
                      {task.label}
                    </span>
                    <button onClick={() => deleteTask(task.id)}>🗑️</button>
                  </>
                )}
              </div>
            ))}

            {/* inline add task section */}
            {col === "todo" && (
              <div className="add-task-inline">
                {isAddingNewTask ? (
                  <input
                    type="text"
                    placeholder={"Enter new task..."}
                    value={newTaskInputLabel}
                    onChange={(e) => setNewTaskInputLabel(e.target.value)}
                    onBlur={() => addNewTaskInline(col)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        enterPressedRef.current = true;
                        addNewTaskInline(col);
                        e.target.blur();
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <button onClick={() => setIsAddingNewTask(true)}>
                    + Add a task
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
