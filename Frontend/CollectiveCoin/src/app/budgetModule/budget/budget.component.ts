import { Component, OnDestroy, OnInit } from '@angular/core';
import { BudgetService } from '../../shared/services/budget.service';
import { Router } from '@angular/router';
import { LoginDataService } from '../../shared/services/login-data.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { BudgetState } from '../budgetStore/budget.reducer';
import {
  selectMonthlyBudget,
  selectOverBudget,
} from '../budgetStore/budget.selector';
import * as BudgetActions from '../budgetStore/budget.actions';
import { budget } from '../../shared/interfaces/budget.interface';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetComponent implements OnInit, OnDestroy {
  isEarning: boolean;
  currentPage: number;
  totalItems: number;
  budgets$: Observable<any>;
  overbudget$: Observable<budget[]>;
  deleteMethod: Function;

  constructor(
    public budgetservice: BudgetService,
    private router: Router,
    private logindataservice: LoginDataService,
    private store: Store<BudgetState>
  ) {}
  updateBudget(id: string) {
    this.router.navigate([`Budget/update-budget/${id}`]);
  }
  ngOnInit(): void {
    this.deleteMethod = BudgetActions.deleteBudget;
    this.logindataservice.isLoggedin().subscribe(() => {
      this.isEarning = this.logindataservice.isEarning;
    });

    this.store.dispatch(BudgetActions.loadBudgets());
    this.budgets$ = this.store.select(selectMonthlyBudget);
    this.overbudget$ = this.store.select(selectOverBudget);
  }

  save() {
    if (this.budgetservice.budgetForm.valid) {
      this.store.dispatch(
        BudgetActions.addBudget(this.budgetservice.budgetForm.value)
      );
    } else {
      alert('please fill the form as directed');
    }
  }
  ngOnDestroy(): void {
    this.budgetservice.budgetForm.reset();
  }
}
