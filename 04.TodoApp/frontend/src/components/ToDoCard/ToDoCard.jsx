import "./ToDoCard.scss";

import { useEffect, useState } from "react";

export const ToDoCard = ({ color, todo, handleDelete, handleEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(todo.description);

  useEffect(() => {
    setDescription(todo.description);
  }, [todo]);

  return (
    <div className="todo-card" style={{ background: color }}>
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

              handleEdit(todo.id, { ...todo, description });
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
