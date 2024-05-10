import { Component, Input, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from '../services/transaction.service';
import { IncomeService } from '../services/income.service';

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
    public incomeservice: IncomeService
  ) {}

  ngOnInit(): void {
    console.log('items called');
  }

  deleteItem(id: any) {
    if (this.deleteMethod) {
      this.deleteMethod(id);
    } else {
      console.error('deleteMethod is not defined');
    }
  }

  updateItem(id: string) {
    console.log('update method is being called for id ', id);

    if (this.updateMethod) {
      this.updateMethod(id);
    } else {
      console.error('updateMethod is not defined');
    }
  }
  showMessage(message: string): void {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
