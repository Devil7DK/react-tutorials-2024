import { useEffect, useMemo, useState } from "react";

export const AddForm = ({ onAdd }) => {
  const [description, setDescription] = useState("Description here");
  const [status, setStatus] = useState("1");

  const handleSubmit = () => {
    fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        status: Number(status),
      }),
    }).then((response) => {
      response.json().then((data) => {
        onAdd(data);
      });
    });
  };

  return (
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

          handleSubmit();
        }}
      >
        Add
      </button>
    </form>
  );
};

// export const AddForm2 = () => {
//   const [number1, setNumber1] = useState(0);
//   const [number2, setNumber2] = useState(0);

//   const result = useMemo(() => {
//     return number1 + number2;
//   }, [number1, number2]);

//   // const [result, setResult] = useState(0);

//   // useEffect(() => {
//   //   setResult(number1 + number2);
//   // }, [number1, number2]);

//   return (
//     <>
//       <input
//         type="number"
//         value={number1}
//         onChange={(e) => {
//           setNumber1(e.target.valueAsNumber);
//         }}
//       />
//       <input
//         type="number"
//         value={number2}
//         onChange={(e) => {
//           setNumber2(e.target.valueAsNumber);
//         }}
//       />
//       <div>{result}</div>
//     </>
//   );
// };
