export const TodoTable = (props) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {props.todos.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <label>Page Number:</label>
        <input
          type="number"
          value={props.pageNumber}
          onChange={(e) => {
            props.onPageChange(e.target.valueAsNumber);
          }}
        />
      </div>
    </>
  );
};
