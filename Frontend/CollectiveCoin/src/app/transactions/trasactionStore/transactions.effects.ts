import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as TransactionActions from './transactions.action';
import { TransactionService } from '../../shared/services/transaction.service';
import { TransactionState } from './transactions.reducer';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TransactionEffects {
  constructor(
    private actions$: Actions,
    private transactionService: TransactionService,
    private store: Store<TransactionState>,
    private snackBar: MatSnackBar
  ) {}

  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.loadTransactions),
      switchMap(() =>
        this.transactionService.getAllTransactions().pipe(
          map((data) =>
            TransactionActions.transactionsLoaded({
              transactions: data.transactions,
            })
          ),
          catchError((error) =>
            of(TransactionActions.transactionsLoadFailed({ error }))
          )
        )
      )
    )
  );

  deleteTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.deleteTransaction),
      switchMap(({ id }) => {
        console.log(id);
        return this.transactionService.deleteTransaction(id).pipe(
          map(() => {
            this.showMessage('transaction deleted successfully');
            this.store.dispatch(TransactionActions.loadTransactions());
            return TransactionActions.deleteTransactionSuccess();
          }),
          catchError((error) =>
            of(TransactionActions.deleteTransactionFailure({ error }))
          )
        );
      })
    )
  );

  filterTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.filterTransactions),
      switchMap(({ formData }) =>
        this.transactionService.getFilteredTransactions(formData).pipe(
          map((filteredData) => {
            console.log('filtered data', filteredData);
            return TransactionActions.filteredTransactionsLoaded({
              filteredTransactions: filteredData.transactions,
            });
          }),
          catchError((error) =>
            of(TransactionActions.filterTransactionsFailed({ error }))
          )
        )
      )
    )
  );

  showMessage(message: string): void {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
