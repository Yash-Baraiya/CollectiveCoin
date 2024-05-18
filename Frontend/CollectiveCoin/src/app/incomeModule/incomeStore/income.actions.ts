import { createAction, props } from '@ngrx/store';
import { IncomeResponse } from '../../shared/interfaces/income.interface';

export const loadIncomes = createAction('[Income] Load Incomes');
export const incomesLoaded = createAction(
  '[Income] Incomes Loaded',
  props<{ incomes: IncomeResponse }>()
);
export const addIncome = createAction(
  '[Income] Add Income',
  props<{ income: any }>() // Define the payload type
);
export const deleteIncome = createAction(
  '[Income] Delete Income',
  props<{ id: string }>()
);
export const incomeError = createAction(
  '[Income] Income Error',
  props<{ error: any }>()
);
