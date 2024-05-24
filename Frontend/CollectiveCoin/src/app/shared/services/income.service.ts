import { Injectable } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IncomeState } from './../../incomeModule/incomeStore/income.reducer';
import * as IncomeActions from './../../incomeModule/incomeStore/income.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { income } from '../interfaces/income.interface';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  incomeForm: FormGroup;

  constructor(private store: Store<IncomeState>, private http: HttpClient) {
    this.incomeForm = new FormGroup({
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

  getIncome() {
    return this.http.get(`${environment.incomeApiUrl}/get-incomes`);
  }

  loadIncomes() {
    this.store.dispatch(IncomeActions.loadIncomes());
  }
  addIncome(income: any) {
    let bodyData = this.incomeForm.value;
    return this.http.post(`${environment.incomeApiUrl}/add-income`, bodyData);
  }

  deleteIncome(id) {
    if (confirm('Are you sure you want to delete this income?')) {
      return this.http.delete(
        `${environment.incomeApiUrl}/delete-income/${id}`
      );
    } else {
      return null;
    }
  }

  //method for showing alert message
}
