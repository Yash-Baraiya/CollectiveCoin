import { createReducer, on } from '@ngrx/store';
import * as TransactionActions from './../actions/transactions.action';
import { Action } from '@ngrx/store';

export interface TransactionState {
  transactions: transactionsObj;
  resentHistory: any[];
  loading: boolean;
  error: any;
}
export const initialState: TransactionState = {
  transactions: { transactions: [] },
  resentHistory: [],
  loading: false,
  error: null,
};
interface transactionsObj {
  transactions: any[];
}

export const transactionReducer = createReducer(
  initialState,
  on(TransactionActions.loadTransactions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TransactionActions.transactionsLoadFailed, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(TransactionActions.transactionsLoaded, (state, { transactions }) => ({
    ...state,
    transactions: { transactions },
    resentHistory: transactions.slice(0, 3),
    loading: false,
    error: null,
  })),
  on(TransactionActions.deleteTransaction, (state, { id }) => ({
    ...state,
    transactions: {
      transactions: state.transactions.transactions.filter(
        (transaction) => transaction.id !== id || transaction._id !== id
      ),
    },
    resentHistory: state.transactions.transactions
      .filter((transaction) => transaction.id !== id)
      .slice(0, 3),
    loading: false,
    error: null,
  })),
  on(
    TransactionActions.filteredTransactionsLoaded,
    (state, { filteredTransactions }) => ({
      ...state,
      transactions: { transactions: filteredTransactions },
      loading: false,
      error: null,
    })
  )
);

export function reducer(state: TransactionState | undefined, action: Action) {
  return transactionReducer(state, action);
}
