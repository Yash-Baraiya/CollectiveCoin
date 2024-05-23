import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IncomeService } from '../../shared/services/income.service';
import * as IncomeActions from './income.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { IncomeState } from './income.reducer';

@Injectable()
export class IncomeEffects {
  constructor(
    private actions$: Actions,
    public incomeService: IncomeService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private store: Store<IncomeState>
  ) {}

  loadIncomes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncomeActions.loadIncomes),
      switchMap(() =>
        this.incomeService.getIncome().pipe(
          map((response: any) => {
            const {
              monthlyincome,
              yearlyTotalincome,
              totalincome,
              maxAmountincome,
              minAmountincome,
            } = response;

            const formattedMonthlyIncome = monthlyincome.map((income) => ({
              ...income,
              date: this.datePipe.transform(income.date, 'MM/dd/yyyy'),
            }));
            return IncomeActions.incomesLoaded({
              incomes: {
                monthlyincome: formattedMonthlyIncome,
                yearlyTotalincome,
                totalincome,
                maxAmountincome,
                minAmountincome,
              },
            });
          }),
          catchError((error) => {
            this.showMessage(error.error.message);
            return of(IncomeActions.incomeError({ error }));
          })
        )
      )
    )
  );

  addIncome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncomeActions.addIncome),
      switchMap(({ income }) =>
        this.incomeService.addIncome(income).pipe(
          tap(() => this.showMessage('income added successfully')),
          map((res) => {
            this.store.dispatch(IncomeActions.loadIncomes());
            return IncomeActions.addIncomeSuccess();
          }),
          catchError((error) => {
            this.showMessage(error.error.message);
            return of(IncomeActions.incomeError({ error }));
          })
        )
      )
    )
  );

  deleteIncome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncomeActions.deleteIncome),
      switchMap(({ id }) => {
        console.log(id);
        return this.incomeService.deleteIncome(id).pipe(
          tap(() => this.showMessage('income deleted successfully')),
          map(() => IncomeActions.deleteIncomeSuccess()),
          catchError((error) => {
            this.showMessage(error.error.message);
            return of(IncomeActions.incomeError({ error }));
          })
        );
      })
    )
  );

  private showMessage(message: any) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
