import React, { useState } from 'react';

function ExpenseList() {
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2024-11-10', reason: 'Food for company officials', amount: '150.00' },
    { id: 2, date: '2024-11-10', reason: 'Water bottles for officials', amount: '30.00' },
    { id: 3, date: '2024-11-10', reason: 'Transportation for officials', amount: '100.00' },
  ]);

  return (
    <div className="min-h-screenpy-8 px-4 flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-primary-dark mb-6">Expense List</h2>
      <div className="w-full max-w-2xl space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="p-4 border  bg-primary-lightest rounded-lg shadow-md flex justify-between items-center"
          >
            <div className="text-primary-darkest">
              <p className="text-lg font-medium">{expense.reason}</p>
              <p className="text-sm text-primary-darker">Date: {expense.date}</p>
            </div>
            <div className="text-primary-dark text-lg font-semibold">
              ${expense.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;
