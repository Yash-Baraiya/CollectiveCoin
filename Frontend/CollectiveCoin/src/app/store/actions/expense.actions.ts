import { createAction, props } from '@ngrx/store';
import { ExpenseResponse } from '../../shared/interfaces/expense.interface';
import { Params } from '@angular/router';

export const loadExpense = createAction(
  '[Expense] Load Expenses',
  props<{ params?: { page?: number; limit?: number } }>()
);
export const expensesLoaded = createAction(
  '[Expense] Expense Loaded',
  props<{ expenses: ExpenseResponse }>()
);
export const addExpense = createAction(
  '[Expense] Add Expense',
  props<{ expense: any }>() // Define the payload type
);
export const addExpenseSuccess = createAction('[Expense] Expense Added');
export const deleteExpense = createAction(
  '[Expense] Delete Expense',
  props<{ id: string }>()
);
export const deleteExpenseSuccess = createAction(
  '[Expense] Expense Deleted',
  props<{ id: string }>()
);

export const Payment = createAction('[Expense]] Payment', props<{ id: any }>());

export const paymentSuccess = createAction(
  '[Expense] Payment Success',
  props<{ link: string }>()
);

export const paymentFailure = createAction(
  '[Expense] Payment Failure',
  props<{ error: any }>()
);
export const ExpenseError = createAction(
  '[Expense] Expense Error',
  props<{ error: any }>()
);

export const clearExpenseStore = createAction(
  '[Expense] Expense Store Cleared'
);
