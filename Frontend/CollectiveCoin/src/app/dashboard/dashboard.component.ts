import { Component, OnInit, OnDestroy } from '@angular/core';
import { IncomeService } from '../shared/services/income.service';
import { ExpenseService } from '../shared/services/expense.service';
import { TransactionService } from '../shared/services/transaction.service';
import { SpinnerService } from '../shared/services/spinner.service';
import * as incomesActions from '../store/actions/income.actions';
import * as transactionsActions from '../store/actions/transactions.action';
import { Store } from '@ngrx/store';
import { Observable, catchError, of } from 'rxjs';
import { IncomeState } from '../store/reducer/income.reducer';
import { TransactionState } from './../store/reducer/transactions.reducer';
import {
  selectMinIncome,
  selectMaxIncome,
  selectIncomeTotal,
  selectYearlyTotalIncome,
} from '../store/selectors/income.selector';
import { selectTransactionsHistory } from '../store/selectors/transactions.selector';
import { ExpenseState } from './../store/reducer/expense.reducer';
import * as expenseActions from '../store/actions/expense.actions';
import {
  selectExpenseTotal,
  selectMaxExpense,
  selectMinExpense,
  selectYearlyTotalExpense,
} from '../store/selectors/expense.selector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  maxIncome$: Observable<any>;
  minIncome$: Observable<any>;
  totalIncome$: Observable<number>;
  yearlyTotalIncomes$: Observable<any>;
  recentHistory$: Observable<any[]>;
  maxExpense$: Observable<any>;
  minExpense$: Observable<any>;
  yearlyTotalExpense$: Observable<any>;
  totalExpense$: Observable<any>;

  constructor(
    public incomeservice: IncomeService,
    public expenseservice: ExpenseService,
    public transactionservice: TransactionService,
    private spinnerservice: SpinnerService,
    private incomestore: Store<IncomeState>,
    private transactionstore: Store<TransactionState>,
    private expensestore: Store<ExpenseState>
  ) {}

  ngOnInit(): void {
    this.spinnerservice.startLoading();

    setTimeout(() => {
      this.spinnerservice.stopLoading();
    }, 2000);

    this.incomestore.dispatch(incomesActions.loadIncomes());
    this.expensestore.dispatch(expenseActions.loadExpense({}));
    this.transactionstore.dispatch(transactionsActions.loadTransactions());

    this.maxIncome$ = this.incomestore
      .select(selectMaxIncome)
      .pipe(catchError(() => of(0)));
    this.minIncome$ = this.incomestore
      .select(selectMinIncome)
      .pipe(catchError(() => of(0)));
    this.totalIncome$ = this.incomestore
      .select(selectIncomeTotal)
      .pipe(catchError(() => of(0)));
    this.yearlyTotalIncomes$ = this.incomestore
      .select(selectYearlyTotalIncome)
      .pipe(catchError(() => of(0)));
    this.recentHistory$ = this.transactionstore
      .select(selectTransactionsHistory)
      .pipe(catchError(() => of([])));
    this.totalExpense$ = this.incomestore
      .select(selectExpenseTotal)
      .pipe(catchError(() => of(0)));
    this.maxExpense$ = this.expensestore
      .select(selectMaxExpense)
      .pipe(catchError(() => of(0)));
    this.minExpense$ = this.expensestore
      .select(selectMinExpense)
      .pipe(catchError(() => of(0)));
    this.yearlyTotalExpense$ = this.expensestore
      .select(selectYearlyTotalExpense)
      .pipe(catchError(() => of(0)));
  }

  ngOnDestroy(): void {}
}
