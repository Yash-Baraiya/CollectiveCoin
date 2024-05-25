import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TransactionState } from './../reducer/transactions.reducer';

export const selectTransactionState =
  createFeatureSelector<TransactionState>('transactions');

export const selectAllTransactions = createSelector(
  selectTransactionState,
  (state: TransactionState) => {
    console.log('State transactions:', state.transactions.transactions);
    return state?.transactions?.transactions ?? [];
  }
);

export const selectTransactionsHistory = createSelector(
  selectTransactionState,
  (state: TransactionState) => {
    console.log('recent', state.transactions.transactions.slice(0, 3));
    return state?.resentHistory ?? [];
  }
);
export const selectTotalTransactions = createSelector(
  selectTransactionState,
  (state: TransactionState) => state.transactions.transactions.length
);
