import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExpenseState } from './../reducer/expense.reducer';
import { expense } from '../../shared/interfaces/expense.interface';

export const selectExpenseState =
  createFeatureSelector<ExpenseState>('expense');

export const selectExpenseData = createSelector(
  selectExpenseState,

  (state) => {
    console.log('state E', state);
    return state?.monthlyexpense ?? [];
  }
);

export const selectExpenseTotal = createSelector(
  selectExpenseState,
  (state) => {
    return state?.totalexpense ?? [];
  }
);

export const selectYearlyTotalExpense = createSelector(
  selectExpenseState,
  (state) => {
    return state?.yearlyTotalExpense ?? [];
  }
);

export const selectMaxExpense = createSelector(
  selectExpenseState,
  (state) => state?.maxAmountexpense ?? 0
);

export const selectMinExpense = createSelector(
  selectExpenseState,
  (state) => state?.minAmountexpense ?? 0
);
export const selectExpenseById = (id: string) =>
  createSelector(selectExpenseState, (state: ExpenseState) =>
    state.monthlyexpense.find((income: expense) => income._id === id)
  );

export const selectExpensesLength = createSelector(
  selectExpenseState,
  (state) => state.expenseAmounts.length
);

export const selectTotalPages = createSelector(selectExpenseState, (state) =>
  Math.ceil(state.expenseAmounts.length / 4)
);

export const selectExpAmounts = createSelector(
  selectExpenseState,
  (state) => state.expenseAmounts
);
