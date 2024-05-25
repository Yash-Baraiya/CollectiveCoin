import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExpenseService } from '../../shared/services/expense.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';
import { expense } from '../../shared/interfaces/expense.interface';
import { ExpenseState } from './../../store/reducer/expense.reducer';
import { Store } from '@ngrx/store';
import * as ExpenseActions from '../../store/actions/expense.actions';
import {
  selectExpenseById,
  selectExpenseData,
} from '../../store/selectors/expense.selector';
@Component({
  selector: 'app-updateexpense',
  templateUrl: './updateexpense.component.html',
  styleUrl: './updateexpense.component.css',
})
export class UpdateexpenseComponent implements OnInit, OnDestroy {
  expenseId = '';
  updateExpenseForm: FormGroup;
  expenseData: expense;
  showCheckbox: boolean = false;
  expenseData$: Observable<expense>;

  constructor(
    public expenseservice: ExpenseService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private datepipe: DatePipe,
    private snackBar: MatSnackBar,
    private router: Router,
    private store: Store<ExpenseState>
  ) {}
  ngOnInit(): void {
    this.updateExpenseForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(80),
      ]),
      date: new FormControl('', [Validators.required]),
      markAspaid: new FormControl(true, [Validators.required]),
      duedate: new FormControl(''),
    });

    this.route.params.subscribe((param) => {
      this.expenseId = param['id'];

      this.expenseData$ = this.store.select(selectExpenseById(this.expenseId));

      this.expenseData$.subscribe((expenseData) => {
        if (expenseData) {
          this.expenseData = expenseData;
          this.updateExpenseForm.patchValue({
            title: this.expenseData.title,
            amount: this.expenseData.amount,
            category: this.expenseData.category,
            description: this.expenseData.description,
            date: this.datepipe.transform(this.expenseData.date, 'MM/dd/yyyy'),
            markAsPaid: this.expenseData.markAspaid,
            duedate: this.expenseData.duedate,
          });
        } else {
          console.log('Expense data is undefined.');
          this.router.navigate(['/Expense']);
        }
      });
    });
  }

  UpdateExpense(id: any): Observable<any> {
    return new Observable((observer) => {
      let bodyData = this.updateExpenseForm.value;

      if (confirm('Are you sure you want to update this expense?')) {
        this.http
          .patch(`${environment.expenseApiUrl}/update-expense/${id}`, bodyData)
          .subscribe(
            (resultData) => {
              this.showMessage('Expense updated successfully');
              this.store.dispatch(ExpenseActions.loadExpense({}));
              console.log(resultData);
              observer.next(resultData);
              observer.complete();
            },
            (error) => {
              console.error(error);
              if (error.error.message) {
                this.showMessage(error.error.message);
              } else {
                this.showMessage(
                  'Something went wrong, please try again after some time.'
                );
              }
              observer.error(error);
            }
          );
      } else {
        observer.complete();
      }
    });
  }

  save() {
    if (this.updateExpenseForm.valid) {
      this.UpdateExpense(this.expenseId).subscribe(
        (resultData) => {
          console.log('Update successful:', resultData);
        },
        (error) => {
          console.error('Update failed', error);
        }
      );
    } else {
      this.showMessage('Please fill out the form correctly.');
    }
  }
  onCategoryChange(event: any) {
    const selectedCategory = event.target.value.trim();
    console.log('Selected Category:', selectedCategory);
    console.log('Is Monthly Bills?', selectedCategory === 'monthlybills');
    this.showCheckbox = selectedCategory === 'monthlybills';
  }

  showMessage(message: string) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }

  ngOnDestroy(): void {
    this.updateExpenseForm.reset();
  }
}
