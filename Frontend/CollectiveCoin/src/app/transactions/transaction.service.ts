import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  alltransactions: Array<any> = [];
  incomedata: Array<any> = [];
  expensedata: Array<any> = [];
  maxincome: number = 0;
  minincome: number = 0;
  maxexpense: number = 0;
  minexpense: number = 0;
  data: any;
  recenthistory: Array<any> = [];
  filtersForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.filtersForm = new FormGroup({
      type: new FormControl('', Validators.required),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });
  }
  gettAllTransactions() {
    this.http
      .get(
        'http://localhost:8000/api/v1/CollectiveCoin/user/transactions/all-transactions'
      )
      .subscribe((resultData) => {
        try {
          this.data = resultData;
          this.incomedata = this.data.incomes.map((income: any) => ({
            title: income.title,
            amount: income.amount[0],
            category: income.category,
            date: income.date.split('T')[0],
            id: income._id,
            type: 'income',
            description: income.description,
            addedBy: income.addedBy,
          }));

          this.expensedata = this.data.expenses.map((expense: any) => ({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: expense.date.split('T')[0],
            id: expense._id,
            type: 'expense',
            description: expense.description,
            addedBy: expense.addedBy,
          }));

          this.alltransactions = this.incomedata.concat(this.expensedata);
          this.alltransactions = this.alltransactions.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            return dateB.getTime() - dateA.getTime();
          });
          this.recenthistory = this.alltransactions.slice(0, 3);
          this.incomedata = this.incomedata.sort((a, b) => {
            return b.amount - a.amount;
          });
          this.expensedata = this.expensedata.sort((a, b) => {
            return b.amount - a.amount;
          });
          this.maxincome = this.incomedata.shift().amount;
          this.minincome = this.incomedata.pop().amount;
          this.maxexpense = this.expensedata.shift().amount;
          this.minexpense = this.expensedata.pop().amount;
        } catch (error) {
          console.log(error);
        }
      });
  }

  deleteTransaction(id) {
    console.log(id);
    this.http
      .delete(
        `http://localhost:8000/api/v1/CollectiveCoin/user/transactions/delete-transaction/${id}`
      )
      .subscribe(
        (resultData) => {
          try {
            if (confirm('are you sure you want to delete this tranaction'))
              console.log(resultData);
            this.showMessage('transaction deleted successfully');
            this.gettAllTransactions();
          } catch (error) {
            console.log(error);
          }
        },
        (error) => {
          console.log(error);
          if (error.error.message) {
            this.showMessage(error.error.message);
          } else {
            this.showMessage(
              'somthing went wrong please try again after some time'
            );
          }
        }
      );
  }

  getFilteredTransactions(): void {
    const formData = this.filtersForm.value;

    this.http
      .get<any>(
        `http://localhost:8000/api/v1/CollectiveCoin/user/transactions/filter`,
        { params: formData }
      )
      .subscribe(
        (filteredData) => {
          try {
            console.log(filteredData);
            this.alltransactions = filteredData.transactions;
          } catch (error) {
            console.log(error);
          }
        },
        (error) => {
          console.log(error);
          if (error.error.message) {
            this.showMessage(error.error.message);
          } else {
            this.showMessage(
              'Something went wrong. Please try again after some time.'
            );
          }
        }
      );
  }
  showMessage(message: any): void {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
