import { Injectable } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ExpenseState } from './../../store/reducer/expense.reducer';
import * as ExpenseActions from '../../store/actions/expense.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  expenseForm: FormGroup;

  constructor(private store: Store<ExpenseState>, private http: HttpClient) {
    this.expenseForm = new FormGroup({
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
  }

  getExpense(page: number, limit: number) {
    let apiUrl = `${environment.expenseApiUrl}/get-expenses`;

    if (page !== undefined && limit !== undefined) {
      apiUrl += `?page=${page}&limit=${limit}`;
    }
    return this.http.get(`${apiUrl}`);
  }
  addExpense(expense: any) {
    let bodyData = this.expenseForm.value;
    return this.http.post(`${environment.expenseApiUrl}/add-expense`, bodyData);
  }

  deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
      return this.http.delete(
        `${environment.expenseApiUrl}/delete-expense/${id}`
      );
    } else {
      return null;
    }
  }

  payment(id) {
    return this.http.post(`${environment.expenseApiUrl}/billpayment/${id}`, {});
  }
}
