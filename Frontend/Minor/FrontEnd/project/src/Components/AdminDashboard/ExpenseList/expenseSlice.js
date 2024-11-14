import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for CRUD operations using fetch
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async () => {
  const response = await fetch('https://api.example.com/expenses');
  const data = await response.json();
  return data;
});

export const addExpense = createAsyncThunk('expenses/addExpense', async (newExpense) => {
  const response = await fetch('https://api.example.com/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newExpense)
  });
  const data = await response.json();
  return data;
});

export const updateExpense = createAsyncThunk('expenses/updateExpense', async (updatedExpense) => {
  const response = await fetch(`https://api.example.com/expenses/${updatedExpense.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedExpense)
  });
  const data = await response.json();
  return data;
});

export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (expenseId) => {
  await fetch(`https://api.example.com/expenses/${expenseId}`, {
    method: 'DELETE'
  });
  return expenseId;
});

// Expense slice
const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
      });
  }
});

export default expenseSlice.reducer;
