import "./ToDoColumn.scss";

import { ToDoCard } from "../ToDoCard/ToDoCard";

export const ToDoColumn = ({ title, color, todos, handleDelete, handleEdit }) => {
  return (
    <div className="todo-column" style={{ background: color }}>
      <div className="title-container">
        <div className="title">{title}</div>
        <div className="count">{todos.length}</div>
      </div>
      <div className="todo-items">
        {todos.map((todo) => (
          <ToDoCard key={todo.id} todo={todo} handleDelete={handleDelete} handleEdit={handleEdit} color={color} />
        ))}
      </div>
    </div>
  );
};
