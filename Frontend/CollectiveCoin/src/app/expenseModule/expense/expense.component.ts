import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ExpenseService } from '../../shared/services/expense.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExpenseState } from '../expenseStore/expense.reducer';
import { Store } from '@ngrx/store';
import * as ExpenseActions from './../expenseStore/expense.actions';
import {
  selectExpenseData,
  selectExpenseTotal,
  selectExpensesLength,
  selectTotalPages,
} from '../expenseStore/expense.selector';
import { expense } from '../../shared/interfaces/expense.interface';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit, OnDestroy {
  showCheckbox: boolean = false;
  currentPage: number = 1;
  totalItems$: Observable<number>;
  showrecurrence: boolean = false;
  totalPages$: Observable<number>;
  totalExpense$: Observable<any[]>;
  expenses$: Observable<expense[]>;
  itemsPerPage: number = 4;
  deleteMethod: Function;

  @ViewChild('markAspaid') markAspaid: ElementRef<HTMLInputElement>;

  constructor(
    public expenseservice: ExpenseService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<ExpenseState>
  ) {}

  ngOnInit(): void {
    this.deleteMethod = ExpenseActions.deleteExpense;
    this.store.dispatch(
      ExpenseActions.loadExpense({
        params: { page: this.currentPage, limit: this.itemsPerPage },
      })
    );

    this.totalExpense$ = this.store.select(selectExpenseTotal);
    this.expenses$ = this.store.select(selectExpenseData);
    this.totalItems$ = this.store.select(selectExpensesLength);
    this.totalPages$ = this.store.select(selectTotalPages);
  }

  nextPage() {
    this.currentPage = this.currentPage + 1;
    this.store.dispatch(
      ExpenseActions.loadExpense({
        params: { page: this.currentPage, limit: this.itemsPerPage },
      })
    );

    this.totalItems$ = this.store.select(selectExpensesLength);
    this.totalPages$ = this.store.select(selectTotalPages);
  }
  previousPage() {
    this.currentPage = this.currentPage - 1;
    this.store.dispatch(
      ExpenseActions.loadExpense({
        params: { page: this.currentPage, limit: this.itemsPerPage },
      })
    );

    this.totalItems$ = this.store.select(selectExpensesLength);
    this.totalPages$ = this.store.select(selectTotalPages);
  }
  updateExpense(id: string) {
    this.router.navigate([`Expense/update-expense/${id}`]);
  }
  onCategoryChange(event: any) {
    const selectedCategory = event.target.value.trim();
    console.log('Selected Category:', selectedCategory);
    console.log('Is Monthly Bills?', selectedCategory === 'monthlybills');
    this.showCheckbox = selectedCategory === 'monthlybills';

    this.showrecurrence = selectedCategory === 'subscriptions';
  }

  saveadd() {
    if (this.expenseservice.expenseForm.valid) {
      this.store.dispatch(
        ExpenseActions.addExpense(this.expenseservice.expenseForm.value)
      );
      this.markAspaid.nativeElement.checked = true;
    } else {
      alert('please fill the form as directed');
    }
  }

  ngOnDestroy(): void {
    this.expenseservice.expenseForm.reset();
  }
}
