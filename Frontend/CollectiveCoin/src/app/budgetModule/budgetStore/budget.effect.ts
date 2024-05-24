import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BudgetService } from '../../shared/services/budget.service';
import * as BudgetActions from './budget.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BudgetState } from './budget.reducer';

@Injectable()
export class BudgetEffects {
  constructor(
    private actions$: Actions,
    public budgetservice: BudgetService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private store: Store<BudgetState>
  ) {}

  loadBudget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BudgetActions.loadBudgets),
      switchMap(() =>
        this.budgetservice.getBudget().pipe(
          map((response: any) => {
            const {
              budgets,
              monthlybudget,
              overbudget,
              underbudget,
              expcategoryAmounts,
              status,
            } = response;

            const formattedMonthlyBudgets = monthlybudget.map((budget) => ({
              ...budget,
              date: this.datePipe.transform(budget.date, 'MM/dd/yyyy'),
            }));
            console.log(response);
            return BudgetActions.budgetsLoaded({
              budgets: {
                monthlybudget: formattedMonthlyBudgets,
                overbudget: overbudget,
                underbudget: underbudget,
                expcategoryAmounts: expcategoryAmounts,
                status: status,
                budgets: budgets,
              },
            });
          }),
          catchError((error) => {
            this.showMessage(error.error.message);
            return of(BudgetActions.budgetError({ error }));
          })
        )
      )
    )
  );

  addBudget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BudgetActions.addBudget),
      switchMap(({ budget }) =>
        this.budgetservice.addBudget(budget).pipe(
          tap(() => this.showMessage('budget added successfully')),
          map((res) => {
            console.log('conming in res', res);
            this.store.dispatch(BudgetActions.loadBudgets());
            return BudgetActions.addBudgetSuccess();
          }),
          catchError((error) => {
            this.showMessage(error.error.message);
            return of(BudgetActions.budgetError({ error }));
          })
        )
      )
    )
  );

  deleteBudget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BudgetActions.deleteBudget),
      switchMap(({ id }) => {
        console.log(id);
        return this.budgetservice.deleteBudget(id).pipe(
          tap(() => this.showMessage('budget deleted successfully')),
          map(() => BudgetActions.deleteBudgetSuccess()),
          catchError((error) => {
            console.log(error);
            this.showMessage(error.error.message);
            return of(BudgetActions.budgetError({ error }));
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
