import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncomeService } from '../income/income.service';
import { ExpenseService } from '../expense/expense.service';
import { TransactionService } from '../transactions/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  totalbalance: any = 0;
  constructor(
    private http: HttpClient,
    public incomeservice: IncomeService,
    public expenseservice: ExpenseService,
    public transactionservice: TransactionService
  ) {}

  ngOnInit(): void {
    this.incomeservice.getIncome();
    this.expenseservice.getExpense();
    this.transactionservice.gettAllTransactions();
  }
}
