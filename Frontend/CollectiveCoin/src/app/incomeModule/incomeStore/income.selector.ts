import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IncomeState } from './income.reducer';
import { income } from '../../shared/interfaces/income.interface';
import { state } from '@angular/animations';

export const selectIncomeState = createFeatureSelector<IncomeState>('income');

export const selectIncomeData = createSelector(
  selectIncomeState,

  (state) => {
    console.log('state I', state);
    return state?.data ?? [];
  }
);

export const selectIncomeTotal = createSelector(selectIncomeState, (state) => {
  return state?.totalIncome ?? 0;
});

export const selectYearlyTotalIncome = createSelector(
  selectIncomeState,
  (state) => {
    return state?.yearlyTotalIncome ?? 0;
  }
);

export const selectMaxIncome = createSelector(
  selectIncomeState,
  (state) => state?.maxIncome ?? 0
);

export const selectMinIncome = createSelector(
  selectIncomeState,
  (state) => state?.minIncome ?? 0
);
export const selectIncomeById = (id: string) =>
  createSelector(selectIncomeState, (state: IncomeState) =>
    state.data.find((income: income) => income._id === id)
  );

export const selectInocmesLength = createSelector(
  selectIncomeState,
  (state) => state.data.length
);
