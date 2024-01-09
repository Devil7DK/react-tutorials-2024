function formatDate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

/**
 * @typedef {Object} Expense
 *
 * @property {Date} date
 * @property {"income" | "expense"} type
 * @property {string} description
 * @property {number} amount
 */

/**
 * @type {Expense[]}
 */
const data = [
  {
    date: new Date(2024, 0, 1),
    type: "income",
    description: "Salary",
    amount: 10000,
  },
  {
    date: new Date(2024, 0, 2),
    type: "expense",
    description: "Groceries",
    amount: 100,
  },
  {
    date: new Date(2024, 0, 3),
    type: "income",
    description: "Freelance Work",
    amount: 500,
  },
  {
    date: new Date(2024, 0, 4),
    type: "expense",
    description: "Dinner Out",
    amount: 50,
  },
  {
    date: new Date(2024, 0, 5),
    type: "income",
    description: "Bonus",
    amount: 2000,
  },
  {
    date: new Date(2024, 0, 6),
    type: "expense",
    description: "Utilities",
    amount: 150,
  },
  {
    date: new Date(2024, 0, 7),
    type: "income",
    description: "Investment Return",
    amount: 800,
  },
  {
    date: new Date(2024, 0, 8),
    type: "expense",
    description: "Movie Tickets",
    amount: 20,
  },
  {
    date: new Date(2024, 0, 9),
    type: "income",
    description: "Part-time Job",
    amount: 300,
  },
  {
    date: new Date(2024, 0, 10),
    type: "expense",
    description: "Coffee",
    amount: 5,
  },
  {
    date: new Date(2024, 0, 11),
    type: "income",
    description: "Gift",
    amount: 50,
  },
  {
    date: new Date(2024, 0, 12),
    type: "expense",
    description: "Gym Membership",
    amount: 30,
  },
  {
    date: new Date(2024, 0, 13),
    type: "income",
    description: "Side Project",
    amount: 400,
  },
  {
    date: new Date(2024, 0, 14),
    type: "expense",
    description: "Books",
    amount: 25,
  },
  {
    date: new Date(2024, 0, 15),
    type: "income",
    description: "Rent from Sublet",
    amount: 600,
  },
  {
    date: new Date(2024, 0, 16),
    type: "expense",
    description: "Transportation",
    amount: 50,
  },
  {
    date: new Date(2024, 0, 17),
    type: "income",
    description: "Consulting Fee",
    amount: 700,
  },
  {
    date: new Date(2024, 0, 18),
    type: "expense",
    description: "Phone Bill",
    amount: 40,
  },
  {
    date: new Date(2024, 0, 19),
    type: "income",
    description: "Dividends",
    amount: 120,
  },
  {
    date: new Date(2024, 0, 20),
    type: "expense",
    description: "Dining Out",
    amount: 75,
  },
];
