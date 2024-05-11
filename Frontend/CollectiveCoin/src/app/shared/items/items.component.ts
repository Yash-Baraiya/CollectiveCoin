import { Component, Input, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from '../services/transaction.service';
import { IncomeService } from '../services/income.service';
import { BudgetService } from '../services/budget.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit {
  @Input() item: any;
  @Input() deleteMethod: Function;
  @Input() updateMethod?: Function;
  constructor(
    public expenseservice: ExpenseService,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public transactionservice: TransactionService,
    public incomeservice: IncomeService,
    public budgetservice: BudgetService
  ) {}

  ngOnInit(): void {}

  deleteItem(id: any) {
    if (this.deleteMethod) {
      if (this.deleteMethod === this.incomeservice.deleteIncome) {
        this.incomeservice.deleteIncome(id);
      } else if (this.deleteMethod === this.expenseservice.deleteExpense) {
        this.expenseservice.deleteExpense(id);
      } else if (
        (this.deleteMethod = this.transactionservice.deleteTransaction)
      ) {
        this.transactionservice.deleteTransaction(id);
      }
    } else {
      console.log('deleteMethod is not defined');
    }
  }

  updateItem(id: string) {
    console.log('update method is being called for id ', id);

    if (this.updateMethod) {
      this.updateMethod(id);
    } else {
      console.log('updateMethod is not defined');
    }
  }
  showMessage(message: string): void {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
