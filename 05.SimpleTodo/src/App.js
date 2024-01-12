import React, { useState, useEffect } from "react";

export const App = () => {
  const [description, setDescription] = useState("Description here");
  const [status, setStatus] = useState("1");

  const [todos, setTodos] = useState([]);

  return (
    <div>
      <h1>Simple Todo</h1>

      <form>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        <label>Status</label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
        >
          <option value="1">Pending</option>
          <option value="2">In Progress</option>
          <option value="3">Completed</option>
        </select>

        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();

            setTodos([...todos, { description, status }]);
          }}
        >
          Add
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
