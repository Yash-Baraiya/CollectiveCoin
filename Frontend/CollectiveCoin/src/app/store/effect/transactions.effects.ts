import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as TransactionActions from './../actions/transactions.action';
import { TransactionService } from '../../shared/services/transaction.service';
import { TransactionState } from './../reducer/transactions.reducer';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Injectable()
export class TransactionEffects {
  constructor(
    private actions$: Actions,
    private transactionService: TransactionService,
    private store: Store<TransactionState>,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.loadTransactions),
      switchMap(() =>
        this.transactionService.getAllTransactions().pipe(
          map((data) => {
            const formattedDateTransactions = data.transactions.map(
              (transaction) => ({
                ...transaction,
                date: this.datePipe.transform(transaction.date, 'MM/dd/yyyy'),
              })
            );
            const formattedTransactions = formattedDateTransactions.map(
              (transaction) => ({
                ...transaction,
                duedate: this.datePipe.transform(
                  transaction.duedate,
                  'MM/dd/yyyy'
                ),
              })
            );

            return TransactionActions.transactionsLoaded({
              transactions: formattedTransactions,
            });
          }),
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
            this.showMessage('Transaction deleted successfully');
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
            const formattedTransactions = filteredData.transactions.map(
              (transaction) => ({
                ...transaction,
                date: this.datePipe.transform(transaction.date, 'dd/MM/yyyy'),
              })
            );
            return TransactionActions.filteredTransactionsLoaded({
              filteredTransactions: formattedTransactions,
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
