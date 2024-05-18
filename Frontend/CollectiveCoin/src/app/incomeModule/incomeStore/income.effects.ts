import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IncomeService } from '../../shared/services/income.service';
import * as IncomeActions from './income.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class IncomeEffects {
  constructor(
    private actions$: Actions,
    public incomeService: IncomeService,
    private snackBar: MatSnackBar
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
            return IncomeActions.incomesLoaded({
              incomes: {
                monthlyincome,
                yearlyTotalincome,
                totalincome,
                maxAmountincome,
                minAmountincome,
              },
            });
          }),
          catchError((error) =>{ 
            this.showMessage(error.error.message)
            return of(IncomeActions.incomeError({ error }))})
        )
      )
    )
  );

  addIncome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncomeActions.addIncome),
      switchMap(({ income }) =>
        this.incomeService.addIncome(income).pipe(
          map(() => IncomeActions.loadIncomes()),
          catchError((error) =>{ 
            this.showMessage(error.error.message)
           return of(IncomeActions.incomeError({ error }))})
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
          map(() => IncomeActions.loadIncomes()),
          catchError((error) =>{
            this.showMessage(error.error.message)
            return  of(IncomeActions.incomeError({ error }))})
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
