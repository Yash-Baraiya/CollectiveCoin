import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { LoginDataService } from '../services/login-data.service';
import { Store } from '@ngrx/store';
import { MembersState } from '../../store/reducer/members.reducer';
import * as MembersActions from './../../store/actions/members.action';
import * as IncomesActions from './../../store/actions/income.actions';
import * as ExpensesActions from './../../store/actions/expense.actions';
import * as BudgetsActions from './../../store/actions/budget.actions';
import * as TransaactionsActions from './../../store/actions/transactions.action';
import { IncomeState } from '../../store/reducer/income.reducer';
import { ExpenseState } from '../../store/reducer/expense.reducer';
import { BudgetState } from '../../store/reducer/budget.reducer';
import { TransactionState } from '../../store/reducer/transactions.reducer';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  imageform: FormGroup;
  name: string = '';
  photo: string = '';

  constructor(
    private router: Router,
    private logindataservice: LoginDataService,
    private memberstore: Store<MembersState>,
    private incomestore: Store<IncomeState>,
    private expensestore: Store<ExpenseState>,
    private budgetstore: Store<BudgetState>,
    private transactionsstore: Store<TransactionState>
  ) {}

  isActive(Route: string) {
    return this.router.isActive(Route, true);
  }

  ngOnInit(): void {
    this.logindataservice.isLoggedin().subscribe((resultData) => {
      this.name = this.logindataservice.username;
      this.logindataservice.photo$.subscribe((photo) => {
        this.photo = photo;
      });
      this.logindataservice.name$.subscribe((name) => {
        this.name = name;
      });
    });
  }

  clearStorage() {
    localStorage.clear();
    this.memberstore.dispatch(MembersActions.cleareMemberStore());
    this.budgetstore.dispatch(BudgetsActions.clearBudgetStore());
    this.incomestore.dispatch(IncomesActions.clearIncomeStore());
    this.expensestore.dispatch(ExpensesActions.clearExpenseStore());
    this.transactionsstore.dispatch(
      TransaactionsActions.clearTransactionsStore()
    );
  }
}
