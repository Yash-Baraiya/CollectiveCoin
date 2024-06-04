import { createAction, props } from '@ngrx/store';

export const loadTransactions = createAction('[Transaction] Load Transactions');
export const transactionsLoaded = createAction(
  '[Transaction] Transactions Loaded',
  props<{ transactions: any[] }>()
);
export const transactionsLoadFailed = createAction(
  '[Transaction] Transactions Load Failed',
  props<{ error: any }>()
);

export const deleteTransaction = createAction(
  '[Transaction] Delete Transaction',
  props<{ id: string }>()
);

export const deleteTransactionSuccess = createAction(
  '[Transaction] Delete Transaction Success'
);

export const deleteTransactionFailure = createAction(
  '[Transaction] Delete Transaction Failure',
  props<{ error: any }>()
);
export const filterTransactions = createAction(
  '[Transaction] Filter Transactions',
  props<{ formData: any }>()
);

export const filteredTransactionsLoaded = createAction(
  '[Transaction] Filtered Transactions Loaded',
  props<{ filteredTransactions: any[] }>()
);

export const filterTransactionsFailed = createAction(
  '[Transaction] Filter Transactions Failed',
  props<{ error: any }>()
);

export const clearTransactionsStore = createAction(
  '[Transaction] Tranaction store cleared'
);
