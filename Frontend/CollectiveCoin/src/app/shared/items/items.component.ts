import { Component, Input, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from '../services/transaction.service';
import { IncomeService } from '../services/income.service';
import { BudgetService } from '../services/budget.service';
import { Store } from '@ngrx/store';
import { IncomeState } from '../../store/reducer/income.reducer';
import * as incomeActions from '../../store/actions/income.actions';
import * as transactionsActions from '../../store/actions/transactions.action';
import { TransactionState } from './../../store/reducer/transactions.reducer';
import * as BudgetActions from '../../store/actions/budget.actions';
import { BudgetState } from '../../store/reducer/budget.reducer';
import * as ExpenseActions from '../../store/actions/expense.actions';
import { ExpenseState } from './../../store/reducer/expense.reducer';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit {
  @Input() item: any;
  @Input() deleteMethod?: Function;
  @Input() updateMethod?: Function;

  payment(id: any) {
    console.log(id);
    this.expensestore.dispatch(ExpenseActions.Payment({ id }));
  }
  constructor(
    public expenseservice: ExpenseService,
    private snackBar: MatSnackBar,
    public transactionservice: TransactionService,
    public incomeservice: IncomeService,
    public budgetservice: BudgetService,
    private incomestore: Store<IncomeState>,
    private transactionstore: Store<TransactionState>,
    private budgetstore: Store<BudgetState>,
    private expensestore: Store<ExpenseState>,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {}

  deleteItem() {
    const id = this.item.id || this.item._id;
    console.log('delete', this.deleteMethod);
    if (this.deleteMethod) {
      if (this.deleteMethod === incomeActions.deleteIncome) {
        this.incomestore.dispatch(incomeActions.deleteIncome({ id }));
      } else if (this.deleteMethod === ExpenseActions.deleteExpense) {
        this.expensestore.dispatch(ExpenseActions.deleteExpense({ id }));
      } else if (this.deleteMethod === transactionsActions.deleteTransaction) {
        this.transactionstore.dispatch(
          transactionsActions.deleteTransaction({ id })
        );
      } else if (this.deleteMethod === BudgetActions.deleteBudget) {
        this.budgetstore.dispatch(BudgetActions.deleteBudget({ id }));
      }
    } else {
      console.log('deleteMethod is not defined');
    }
  }

  updateItem() {
    const id = this.item.id || this.item._id;
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
