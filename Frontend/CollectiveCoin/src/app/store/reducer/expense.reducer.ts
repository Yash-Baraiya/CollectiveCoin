import { createReducer, on } from '@ngrx/store';
import * as ExpenseActions from '../../store/actions/expense.actions';
import { expense } from '../../shared/interfaces/expense.interface';

export interface ExpenseState {
  totalexpense: any[];
  monthlyexpense: expense[];
  yearlyTotalExpense: any[];
  minAmountexpense: number;
  maxAmountexpense: number;
  expenseAmounts: any[];
  loading: boolean;
  error: any;
}

const initialState: ExpenseState = {
  totalexpense: [],
  monthlyexpense: [],
  yearlyTotalExpense: [],
  minAmountexpense: 0,
  maxAmountexpense: 0,
  expenseAmounts: [],
  loading: false,
  error: null,
};

export const expenseReducer = createReducer(
  initialState,
  on(ExpenseActions.loadExpense, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ExpenseActions.expensesLoaded, (state, { expenses }) => ({
    ...state,
    monthlyexpense: expenses.monthlyexpense,
    totalexpense: expenses.totalexpense[0].totalexpense,
    yearlyTotalExpense: expenses.yearlyTotalExpense[0].yearlyTotalExpense,
    minAmountexpense: expenses.minAmountexpense,
    maxAmountexpense: expenses.maxAmountexpense,
    expenseAmounts: expenses.expenseAmounts,
    loading: false,
  })),
  on(ExpenseActions.addExpense, (state, { expense }) => ({
    ...state,
    data: [...state.monthlyexpense],
  })),
  on(ExpenseActions.deleteExpenseSuccess, (state, { id }) => ({
    ...state,
    monthlyexpense: state.monthlyexpense.filter(
      (expense) => expense._id !== id
    ),
  })),
  on(ExpenseActions.ExpenseError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ExpenseActions.clearExpenseStore, () => initialState)
);
