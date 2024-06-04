import { createReducer, on } from '@ngrx/store';
import * as BudgetActions from '../actions/budget.actions';
import {
  BudgetResponse,
  budget,
} from '../../shared/interfaces/budget.interface';
import { state } from '@angular/animations';

export interface BudgetState {
  budgets: budget[];
  overbudget: budget[];
  underbudget: budget[];
  monthlybudget: budget[];
  expcategoryAmounts: object;
  loading: boolean;
  error: any;
}

const initialState: BudgetState = {
  budgets: [],
  overbudget: [],
  underbudget: [],
  monthlybudget: [],
  expcategoryAmounts: {},
  loading: false,
  error: null,
};

export const budgetReducer = createReducer(
  initialState,
  on(BudgetActions.loadBudgets, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BudgetActions.budgetsLoaded, (state, { budgets }) => ({
    ...state,
    budgets: budgets.budgets,
    overbudget: budgets.overbudget,
    underbudget: budgets.underbudget,
    expcategoryAmounts: budgets.expcategoryAmounts,
    monthlybudget: budgets.monthlybudget,
    loading: false,
  })),
  on(BudgetActions.addBudget, (state, { budget }) => ({
    ...state,
    budgets: [...state.budgets, budget],
  })),
  on(BudgetActions.deleteBudgetSuccess, (state, { id }) => ({
    ...state,
    monthlybudget: state.monthlybudget.filter((budget) => budget._id !== id),
  })),
  on(BudgetActions.budgetError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(BudgetActions.clearBudgetStore, () => initialState)
);
