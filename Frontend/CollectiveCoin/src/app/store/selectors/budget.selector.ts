import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BudgetState } from '../reducer/budget.reducer';
import { budget } from '../../shared/interfaces/budget.interface';

export const selectBudgetState = createFeatureSelector<BudgetState>('budget');

export const selectMonthlyBudget = createSelector(
  selectBudgetState,

  (state) => {
    return state?.monthlybudget ?? [];
  }
);

export const selectOverBudget = createSelector(selectBudgetState, (state) => {
  return state?.overbudget ?? [];
});

export const selectUnderBudget = createSelector(selectBudgetState, (state) => {
  return state?.underbudget ?? [];
});
export const selectBudgetById = (id: string) =>
  createSelector(selectBudgetState, (state: BudgetState) =>
    state.monthlybudget.find((budget: budget) => budget._id === id)
  );

export const selectExpCategoryAmounts = createSelector(
  selectBudgetState,
  (state) => {
    return state?.expcategoryAmounts ?? [];
  }
);
