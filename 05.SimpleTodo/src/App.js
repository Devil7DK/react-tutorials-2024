import React, { useState, useEffect } from "react";

import { TodoTable } from "./components/TodoTable/TodoTable";
import { AddForm } from "./components/AddForm/AddForm";

export const App = () => {
  const [todos, setTodos] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber,
      }),
    })
      .then((response) => {
        response.json().then((data) => {
          setTodos(data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pageNumber]);

  return (
    <div>
      <h1>Simple Todo</h1>

      <AddForm
        onAdd={(todo) => {
          setTodos([...todos, todo]);
        }}
      />

      <TodoTable todos={todos} pageNumber={pageNumber} onPageChange={setPageNumber} />
    </div>
  );
};
