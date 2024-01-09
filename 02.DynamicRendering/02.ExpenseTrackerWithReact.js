function AddForm({ onAdd }) {
  const [date, setDate] = React.useState(() => new Date());
  const [type, setType] = React.useState("income");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState(0);

  return (
    <div className="input-container">
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="txtDate">Date</label>
            </td>
            <td>
              <input id="txtDate" type="date" value={formatDate(date)} onChange={(e) => setDate(e.target.valueAsDate)} />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="txtType">Type</label>
            </td>
            <td>
              <select id="txtType" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="income" selected>
                  Income
                </option>
                <option value="expense">Expense</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="txtDescription">Description</label>
            </td>
            <td>
              <input id="txtDescription" type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="txtAmount">Amount</label>
            </td>
            <td>
              <input id="txtAmount" type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.valueAsNumber)} />
            </td>
          </tr>
          <tr>
            <td></td>
            <td className="add">
              <button
                onClick={() => {
                  onAdd({
                    date,
                    type,
                    description,
                    amount,
                  });

                  setDate(new Date());
                  setDescription("");
                  setAmount(0);
                }}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function App() {
  const [tableData, setTableData] = React.useState(data);

  const onInputChange = (e) => {
    const clonedData = [...tableData];

    const index = Number(e.target.parentElement.parentElement.getAttribute("data-index"));
    const property = e.target.name;

    if (!isNaN(index) && property && clonedData[index]) {
      const expense = clonedData[index];

      switch (property) {
        case "date":
          expense.date = e.target.valueAsDate;
          break;
        case "amount":
          expense.amount = e.target.valueAsNumber;
          break;
        default:
          expense[property] = e.target.value;
      }

      setTableData(clonedData);
    }
  };

  let balance = 0;

  return (
    <>
      <AddForm onAdd={(item) => setTableData([...tableData, item])} />
      <div className="table-container">
        <table id="tblExpenses">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "50%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th className="amount">Amount</th>
              <th className="amount">Balance</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((expense, index) => {
              const date = formatDate(expense.date);

              if (expense.type === "income") {
                balance += expense.amount;
              } else {
                balance -= expense.amount;
              }

              return (
                <tr data-index={index}>
                  <td>
                    <input name="date" type="date" value={date} onChange={onInputChange} />
                  </td>
                  <td>
                    <select name="type" onChange={onInputChange}>
                      <option value="income" selected={expense.type === "income"}>
                        Income
                      </option>
                      <option value="expense" selected={expense.type === "expense"}>
                        Expense
                      </option>
                    </select>
                  </td>
                  <td>
                    <input name="description" value={expense.description} onChange={onInputChange} />
                  </td>
                  <td className="amount">
                    <input name="amount" type="number" min="0" value={expense.amount} onChange={onInputChange} />
                  </td>
                  <td className="amount">{balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="balance-container">
        <div>Final Balance:</div>
        <div id="balance">{balance}</div>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
