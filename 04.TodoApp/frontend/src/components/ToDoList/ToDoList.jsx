import "./ToDoList.scss";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ToDoColumn } from "../ToDoColumn/ToDoColumn";

const ToDoStatus = {
  Pending: 1,
  InProgress: 2,
  Done: 3,
};

export const ToDoList = () => {
  const [todos, setTodos] = useState([]);

  const pendingTodos = useMemo(() => todos.filter((todo) => todo.status === ToDoStatus.Pending), [todos]);
  const inProgressTodos = useMemo(() => todos.filter((todo) => todo.status === ToDoStatus.InProgress), [todos]);
  const doneTodos = useMemo(() => todos.filter((todo) => todo.status === ToDoStatus.Done), [todos]);

  const handleEdit = useCallback(
    (id, updatedValues) => {
      const originalTodo = todos.find((todo) => todo.id === id);

      const updatedTodo = {
        ...originalTodo,
        ...updatedValues,
      };

      console.log(id, updatedValues, updatedTodo);

      setTodos((todos) =>
        todos.map((todo) => {
          if (todo.id === id) {
            return updatedTodo;
          } else {
            return todo;
          }
        })
      );

      fetch(`/api/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              setTodos((todos) =>
                todos.map((todo) => {
                  if (todo.id === id) {
                    return {
                      ...todo,
                      ...data,
                    };
                  } else {
                    return todo;
                  }
                })
              );
            });
          } else {
            throw new Error("Error editing todo");
          }
        })
        .catch((err) => {
          console.error("Error editing todo", err);
          alert("Error editing todo");

          setTodos((todos) =>
            todos.map((todo) => {
              if (todo.id === id) {
                return originalTodo;
              } else {
                return todo;
              }
            })
          );
        });
    },
    [todos]
  );

  const handleDelete = useCallback((id) => {
    fetch(`/api/todo/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTodos((todos) => todos.filter((todo) => todo.id !== id));
        } else {
          console.error("Error deleting todo", res);
          alert("Error deleting todo");
        }
      })
      .catch((err) => {
        console.error("Error deleting todo", err);
        alert("Error deleting todo");
      });
  }, []);

  useEffect(() => {
    fetch("/api/todos").then((res) => {
      res.json().then((data) => {
        setTodos(data);
      });
    });
  }, []);

  return (
    <div className="todo-list">
      <ToDoColumn title="Pending" color="#ffd7d7" status={ToDoStatus.Pending} todos={pendingTodos} handleDelete={handleDelete} handleEdit={handleEdit} />
      <ToDoColumn title="In Progress" color="#91c7ff" status={ToDoStatus.InProgress} todos={inProgressTodos} handleDelete={handleDelete} handleEdit={handleEdit} />
      <ToDoColumn title="Done" color="#7affce" status={ToDoStatus.Done} todos={doneTodos} handleDelete={handleDelete} handleEdit={handleEdit} />
    </div>
  );
};
