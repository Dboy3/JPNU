import React, { useState, useEffect } from "react";

const ExpenseForm = () => {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses from the API when the component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/jobs/expenditure",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.expenditures && data.expenditures.length > 0) {
          setExpenses(data.expenditures);
        } else {
          setExpenses([]); // Handle the case when there are no expenses
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []); // Empty dependency array to run only once when the component mounts

  // Handle adding a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);

    // Validate expenditure value: min 1 and max 100000
    if (amountValue < 1 || amountValue > 100000) {
      alert("Please enter a valid amount between Rs. 1 and Rs. 100,000.");
      return;
    }

    const newExpense = {
      description: reason,
      expenditure: amountValue.toFixed(2),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/api/jobs/expenditure/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExpense),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.message === "Expenditure entry added successfully") {
        // Add the new expense to the local state list
        setExpenses((prevExpenses) => [...prevExpenses, data.newEntry]);
        setReason("");
        setAmount("");
      } else {
        console.error("Error adding expense:", data);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="p-6 w-full md:max-w-3xl mx-auto space-y-8">
      {/* Add New Expense Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add New Expense
        </h2>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-gray-700">
              Reason for Expense
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              className="mt-1 p-2 w-full border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark"
              placeholder="Enter reason"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
              placeholder="Enter amount"
              required
              min="1"
              max="100000"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-dark text-white p-2 rounded-md hover:bg-primary-darkest transition"
          >
            Add Expense
          </button>
        </form>
      </section>

      {/* Expense List Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Expense List
        </h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses to display</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li
                key={expense._id}
                className="p-4 border rounded-md bg-gray-50 flex justify-between items-center"
                style={{ backgroundColor: "hsla(240, 100%, 70%, .45)" }}
              >
                <span>{expense.description}</span>
                <span className="font-semibold">Rs. {expense.expenditure}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ExpenseForm;
