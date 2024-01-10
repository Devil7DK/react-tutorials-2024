import "./ToDoColumn.scss";

import { ToDoCard } from "../ToDoCard/ToDoCard";
import { useState } from "react";

export const ToDoColumn = ({ title, status, color, todos, handleDelete, handleEdit }) => {
  const [isDropping, setIsDropping] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDropping(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDropping(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDropping(false);

    const id = e.dataTransfer.getData("id");

    handleEdit(id, {
      status,
    });
  };

  return (
    <div className={`todo-column ${isDropping ? "dropping" : "  "}`} style={{ background: color }}>
      <div className="title-container">
        <div className="title">{title}</div>
        <div className="count">{todos.length}</div>
      </div>
      <div className="todo-items" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        {todos.map((todo) => (
          <ToDoCard key={todo.id} todo={todo} handleDelete={handleDelete} handleEdit={handleEdit} color={color} />
        ))}
      </div>
    </div>
  );
};
