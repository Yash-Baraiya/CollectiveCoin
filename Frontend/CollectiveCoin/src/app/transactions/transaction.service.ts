import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  alltransactions: Array<any> = [];
  incomedata: Array<any> = [];
  expensedata: Array<any> = [];
  maxincome: number;
  minincome: number;
  maxexpense: number;
  minexpense: number;
  data: any;
  recenthistory: Array<any> = [];
  constructor(private http: HttpClient, private router: Router) {}
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
            date: income.date,
            id: income._id,
            type: 'income',
          }));

          this.expensedata = this.data.expenses.map((expense: any) => ({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            id: expense._id,
            type: 'expense',
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
            alert('transaction deleted successfully');
            this.gettAllTransactions();
          } catch (error) {
            console.log(error);
          }
        },
        (error) => {
          console.log(error);
          if (error.error.message) {
            alert(error.error.message);
          } else {
            alert('somthing went wrong please try again after some time');
          }
        }
      );
  }
}
