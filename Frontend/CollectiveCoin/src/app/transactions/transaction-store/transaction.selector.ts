import { createAction, props } from '@ngrx/store';

export const loadTransactions = createAction(
  '[Transactions]  load Transactions',
  props<transactionResponse>()
);
