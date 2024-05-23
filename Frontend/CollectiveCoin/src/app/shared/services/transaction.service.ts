import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  filtersForm: FormGroup;
  constructor(private http: HttpClient) {
    this.filtersForm = new FormGroup({
      type: new FormControl('', Validators.required),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });
  }

  getAllTransactions(): Observable<any> {
    return this.http.get<any>(
      `${environment.transactionsApiUrl}/all-transactions`
    );
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(
      `${environment.transactionsApiUrl}/delete-transaction/${id}`
    );
  }
  getFilteredTransactions(formData: any): Observable<any> {
    console.log('formdata', formData);
    return this.http.get<any>(`${environment.transactionsApiUrl}/filter`, {
      params: formData,
    });
  }
}
