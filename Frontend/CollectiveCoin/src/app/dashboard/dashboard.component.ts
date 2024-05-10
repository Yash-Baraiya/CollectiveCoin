import { Component, OnInit, OnDestroy } from '@angular/core';
import { IncomeService } from '../shared/services/income.service';
import { ExpenseService } from '../shared/services/expense.service';
import { TransactionService } from '../shared/services/transaction.service';
import { SpinnerService } from '../shared/services/spinner.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    public incomeservice: IncomeService,
    public expenseservice: ExpenseService,
    public transactionservice: TransactionService,
    private spinnerservice: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinnerservice.startLoading();

    setTimeout(() => {
      this.spinnerservice.stopLoading();
    }, 2000);
    this.incomeservice.getIncome().subscribe(() => {});
    this.expenseservice.getExpense().subscribe(() => {});
    this.transactionservice.gettAllTransactions().subscribe(() => {});
  }
  ngOnDestroy(): void {
    this.transactionservice.maxexpense = 0;
    this.transactionservice.maxincome = 0;
    this.transactionservice.minincome = 0;
    this.transactionservice.minexpense = 0;
  }
}
