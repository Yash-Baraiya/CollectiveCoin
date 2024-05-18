import { Component, OnInit, OnDestroy } from '@angular/core';
import { IncomeService } from '../shared/services/income.service';
import { ExpenseService } from '../shared/services/expense.service';
import { TransactionService } from '../shared/services/transaction.service';
import { SpinnerService } from '../shared/services/spinner.service';
import * as incomesActions from '../incomeModule/incomeStore/income.actions';
import * as transactionsActions from '../transactions/trasactionStore/transactions.action';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IncomeState } from '../incomeModule/incomeStore/income.reducer';
import { TransactionState } from '../transactions/trasactionStore/transactions.reducer';
import {
  selectMinIncome,
  selectMaxIncome,
  selectIncomeTotal,
  selectYearlyTotalIncome,
} from '../incomeModule/incomeStore/income.selector';
import { selectTransactionsHistory } from '../transactions/trasactionStore/transactions.selector';

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

  constructor(
    public incomeservice: IncomeService,
    public expenseservice: ExpenseService,
    public transactionservice: TransactionService,
    private spinnerservice: SpinnerService,
    private incomestore: Store<IncomeState>,
    private transactionstore: Store<TransactionState>
  ) {}

  ngOnInit(): void {
    this.spinnerservice.startLoading();

    setTimeout(() => {
      this.spinnerservice.stopLoading();
    }, 2000);

    this.incomestore.dispatch(incomesActions.loadIncomes());
    this.transactionstore.dispatch(transactionsActions.loadTransactions());

    this.maxIncome$ = this.incomestore.select(selectMaxIncome);
    this.minIncome$ = this.incomestore.select(selectMinIncome);
    this.totalIncome$ = this.incomestore.select(selectIncomeTotal);
    this.yearlyTotalIncomes$ = this.incomestore.select(selectYearlyTotalIncome);
    this.recentHistory$ = this.transactionstore.select(
      selectTransactionsHistory
    );

    this.expenseservice.getExpense().subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.expenseservice.maxexpense = 0;
    this.expenseservice.minexpense = 0;
  }
}
