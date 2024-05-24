import { Injectable } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IncomeState } from './../../incomeModule/incomeStore/income.reducer';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  budgetForm: FormGroup;

  constructor(private store: Store<IncomeState>, private http: HttpClient) {
    this.budgetForm = new FormGroup({
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
    });
  }

  getBudget() {
    return this.http.get(`${environment.budgetApiUrl}/get-budgets`);
  }

  addBudget(budget: any) {
    let bodyData = this.budgetForm.value;
    console.log('bodydata', bodyData);
    return this.http.post(`${environment.budgetApiUrl}/add-budget`, bodyData);
  }

  deleteBudget(id) {
    if (confirm('Are you sure you want to delete this budget?')) {
      return this.http.delete(
        `${environment.budgetApiUrl}/delete-budget/${id}`
      );
    } else {
      return null;
    }
  }
}
