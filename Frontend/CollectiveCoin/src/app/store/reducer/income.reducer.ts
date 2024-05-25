import { createReducer, on } from '@ngrx/store';
import * as IncomeActions from '../actions/income.actions';
import {
  IncomeResponse,
  income,
} from '../../shared/interfaces/income.interface';

export interface IncomeState {
  data: income[];
  yearlyTotalIncome: any;
  totalIncome: any;
  maxIncome: any;
  minIncome: any;
  loading: boolean;
  error: any;
}

const initialState: IncomeState = {
  data: [],
  yearlyTotalIncome: 0,
  totalIncome: 0,
  maxIncome: 0,
  minIncome: 0,
  loading: false,
  error: null,
};

export const incomeReducer = createReducer(
  initialState,
  on(IncomeActions.loadIncomes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(IncomeActions.incomesLoaded, (state, { incomes }) => ({
    ...state,
    data: incomes.monthlyincome,
    yearlyTotalIncome: incomes.yearlyTotalincome[0].yearlyTotalincome,
    totalIncome: incomes.totalincome[0].totalincome,
    maxIncome: incomes.maxAmountincome,
    minIncome: incomes.minAmountincome,
    loading: false,
  })),
  on(IncomeActions.addIncome, (state, { income }) => ({
    ...state,
    data: [...state.data],
  })),
  on(IncomeActions.deleteIncomeSuccess, (state, { id }) => ({
    ...state,
    data: state.data.filter((income) => income._id !== id),
  })),
  on(IncomeActions.incomeError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
