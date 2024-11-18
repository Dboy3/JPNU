import React, { useEffect, useState } from "react";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Fetch data from the API
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
        console.log("data ", data);
        setExpenses(data.expenditures);
        // Assuming the total expenditure comes from the API as well
        // setTotalExpenditure(data.totalExpenditure); // Uncomment this if applicable
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []); // Empty dependency array ensures this runs only once on mount

  console.log(expenses);
  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-primary-dark mb-6">
        Expense List
      </h2>

      {expenses.length > 0 ? (
        <div className="w-full max-w-2xl space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="p-4 border bg-primary-lightest rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="text-primary-darkest">
                <p className="text-lg font-medium">{expense.description}</p>
                <p className="text-sm text-primary-darker">
                  Date: {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-primary-dark text-lg font-semibold">
                Rs. {expense.expenditure}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-primary-darker text-center">
          No expenses to display.
        </p>
      )}
    </div>
  );
}

export default ExpenseList;
