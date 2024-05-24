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
  '[Income] Delete Budget',
  props<{ id: string }>()
);
export const deleteBudgetSuccess = createAction('[Income] Budget Deleted');
export const budgetError = createAction(
  '[Income] Budget Error',
  props<{ error: any }>()
);
