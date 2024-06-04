import { Component, OnInit, OnDestroy } from '@angular/core';
import { IncomeService } from '../../shared/services/income.service';
import { Router } from '@angular/router';
import { LoginDataService } from '../../shared/services/login-data.service';
import { Observable } from 'rxjs';
import { IncomeState } from '../../store/reducer/income.reducer';
import { Store } from '@ngrx/store';
import * as incomeActions from '../../store/actions/income.actions';
import {
  selectIncomeData,
  selectIncomeTotal,
  selectInocmesLength,
} from '../../store/selectors/income.selector';
import { income } from '../../shared/interfaces/income.interface';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent implements OnInit, OnDestroy {
  isEarning: boolean;
  currentPage: number;
  totalIncome$: Observable<number>;
  incomes$: Observable<income[]>;
  deleteMethod: Function;
  totalItems$: Observable<number>;

  constructor(
    public incomeservice: IncomeService,
    private router: Router,
    private logindataservice: LoginDataService,
    private store: Store<IncomeState>
  ) {
    this.logindataservice.isLoggedin().subscribe(() => {
      this.isEarning = this.logindataservice.isEarning;
    });
  }
  ngOnInit(): void {
    this.deleteMethod = incomeActions.deleteIncome;
    this.store.dispatch(incomeActions.loadIncomes());

    this.totalIncome$ = this.store.select(selectIncomeTotal);
    this.incomes$ = this.store.select(selectIncomeData);
    this.totalItems$ = this.store.select(selectInocmesLength);
    console.log(this.incomes$);
  }

  updateIncome(id: string) {
    this.router.navigate([`Income/update-income/${id}`]);
  }

  save() {
    if (this.incomeservice.incomeForm.valid) {
      this.store.dispatch(
        incomeActions.addIncome(this.incomeservice.incomeForm.value)
      );
      this.totalItems$ = this.store.select(selectInocmesLength);
    } else {
      alert('Please fill the form as directed');
    }
  }
  delete(id) {
    this.store.dispatch(incomeActions.deleteIncome({ id }));
  }
  ngOnDestroy() {
    this.incomeservice.incomeForm.reset();
  }
}
