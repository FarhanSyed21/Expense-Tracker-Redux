import { createSlice } from "@reduxjs/toolkit";

const initialListState = {
  expenses: [],
  totalAmount: 0,
  editingId: null
};

const listDataSlice = createSlice({
  name: "listData",
  initialState: initialListState,
  reducers: {
    addExpense(state, action) {
      const newItems = action.payload.expense;
      const existingItem = state.expenses.find(
        (expense) => expense.id === newItems.id
      );

      if (!existingItem) {
        state.totalAmount += Number(action.payload.expense.amount);
        state.expenses.push({
          ...newItems
        });
      }
    },
    removeExpense(state, action) {
      const id = action.payload.id;

      const updatedExpenses = state.expenses.filter(
        (expense) => expense.id !== id
      );

      const removedExpense = state.expenses.find(
        (expense) => expense.id === id
      );

      if (removedExpense) {
        state.totalAmount -= Number(removedExpense.amount);
        state.expenses = updatedExpenses;
      }
    },
    editExpense(state, action) {
      const { id, money, description, category } = action.payload;
      const expenseIndex = state.expenses.findIndex(
        (expense) => expense.id === id
      );

      if (expenseIndex !== -1) {
        const updatedExpense = {
          ...state.expenses[expenseIndex],
          id,
          money,
          description,
          category
        };

        state.expenses[expenseIndex] = updatedExpense;
      }
    },
    clearExpenses(state) {
      state.expenses = [];
      state.totalAmount = 0;
      state.editingId = null;
    },
    setEditingId(state, action) {
      state.editingId = action.payload;
    },
    clearEditingId(state) {
      state.editingId = null;
    }
  }
});

export const listActions = listDataSlice.actions;

export default listDataSlice.reducer;
