import { createAction, props } from '@ngrx/store';
import { BudgetResponse } from '../../shared/interfaces/budget.interface';

export const loadBudgets = createAction('[Budget] Load Budgets');
export const budgetsLoaded = createAction(
  '[Budget] Budgets Loaded',
  props<{ budgets: BudgetResponse }>()
);
export const addBudget = createAction(
  '[Budget] Add Budget',
  props<{ budget: any }>() // Define the payload type
);
export const addBudgetSuccess = createAction('[Budget] Budget Added');
export const deleteBudget = createAction(
  '[Budget] Delete Budget',
  props<{ id: string }>()
);
export const deleteBudgetSuccess = createAction(
  '[Budget] Budget Deleted',
  props<{ id: string }>()
);
export const budgetError = createAction(
  '[Budget] Budget Error',
  props<{ error: any }>()
);

export const clearBudgetStore = createAction('[Budget] Budget Store Cleared');
