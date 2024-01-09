function onInputChange(e) {
  const index = Number(e.target.parentElement.parentElement.getAttribute("data-index"));
  const property = e.target.name;

  if (!isNaN(index) && property && data[index]) {
    const expense = data[index];

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

    refreshUI();
  }
}

function add() {
  const txtDate = document.getElementById("txtDate");
  const txtType = document.getElementById("txtType");
  const txtDescription = document.getElementById("txtDescription");
  const txtAmount = document.getElementById("txtAmount");

  const date = txtDate.valueAsDate;
  const type = txtType.value;
  const description = txtDescription.value;
  const amount = txtAmount.valueAsNumber;

  data.push({
    date,
    type,
    description,
    amount,
  });

  txtDate.value = formatDate(new Date());
  txtDescription.value = "";
  txtAmount.value = 0;

  refreshUI();
}

function refreshUI() {
  let balance = 0;

  const rows = [];

  for (let i = 0; i < data.length; i++) {
    const { amount, description, ...expense } = data[i];

    const date = `${expense.date.getFullYear()}-${(expense.date.getMonth() + 1).toString().padStart(2, "0")}-${expense.date.getDate().toString().padStart(2, "0")}`;

    if (expense.type === "income") {
      balance += amount;
    } else {
      balance -= amount;
    }

    rows.push(/*html*/ `
        <tr data-index="${i}" >
          <td>
            <input name="date" type="date" value="${date}" onchange="onInputChange(event)" />
          </td>
          <td>
            <select name="type" onchange="onInputChange(event)">
              <option value="income" ${expense.type === "income" ? "selected" : ""}>Income</option>
              <option value="expense" ${expense.type === "expense" ? "selected" : ""}>Expense</option>
            </select>
          </td>
          <td>
            <input name="description" value="${description}" onchange="onInputChange(event)" />
          </td>
          <td class="amount">
            <input name="amount" type="number" min="0" value="${amount}" onchange="onInputChange(event)" />
          </td>
          <td class="amount">
            ${balance}
          </td>
        </tr>
    `);
  }

  document.querySelector("#tblExpenses tbody").innerHTML = rows.join("\n");
  document.getElementById("balance").innerText = balance;
}

refreshUI();

document.getElementById("btnAdd").addEventListener("click", add);
