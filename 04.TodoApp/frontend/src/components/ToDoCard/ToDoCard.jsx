import "./ToDoCard.scss";

import { useEffect, useState } from "react";

export const ToDoCard = ({ color, todo, handleDelete, handleEdit }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(todo.description);

  const onDragStart = (e) => {
    e.dataTransfer.setData("id", todo.id);
    setIsDragging(true);
  };

  const onDragEnd = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    setDescription(todo.description);
  }, [todo]);

  return (
    <div className={`todo-card ${isDragging ? "dragging" : ""}`} style={{ background: color }} onDragStart={onDragStart} onDragEnd={onDragEnd} draggable>
      {!isEditing && (
        <div className="top-bar">
          <div className="delete" onClick={() => handleDelete(todo.id)}>
            X
          </div>
        </div>
      )}
      <div className="content">
        {isEditing ? (
          <textarea
            onBlur={() => {
              setIsEditing(false);

              if (description === todo.description) {
                return;
              }

              handleEdit(todo.id, { description });
            }}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            autoFocus
          />
        ) : (
          <div
            className="description"
            onDoubleClick={() => {
              setIsEditing(true);
            }}
          >
            {todo.description}
          </div>
        )}
      </div>
    </div>
  );
};
