import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncomeService } from '../income/income.service';
import { ExpenseService } from '../expense/expense.service';
import { TransactionService } from '../transactions/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    public incomeservice: IncomeService,
    public expenseservice: ExpenseService,
    public transactionservice: TransactionService
  ) {}

  ngOnDestroy(): void {
    this.transactionservice.maxexpense = 0;
    this.transactionservice.maxincome = 0;
    this.transactionservice.minincome = 0;
    this.transactionservice.minexpense = 0;
  }
  ngOnInit(): void {
    this.incomeservice.getIncome();
    this.expenseservice.getExpense();
    this.transactionservice.gettAllTransactions();
  }
}
