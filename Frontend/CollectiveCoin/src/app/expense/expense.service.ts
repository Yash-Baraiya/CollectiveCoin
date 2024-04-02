import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ExpenseResponse from './expense.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  expenseForm: FormGroup;
  date: Date = new Date();
  data: any = [];
  amounts: any = [];
  amountsvalue: Array<number> = [];
  totalexpense: number = 0;

  constructor(private http: HttpClient, private router: Router) {
    this.expenseForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      date: new FormControl('', [Validators.required]),
    });
  }

  addExpense() {
    let bodyData = this.expenseForm.value;
    console.log(bodyData);
    this.http
      .post(
        'http://localhost:8000/api/v1/CollectiveCoin/user/expenses/add-expense',
        bodyData
      )
      .subscribe(
        (resultData) => {
          try {
            console.log(resultData);

            alert('expense added successfully');
            this.getExpense();
            this.expenseForm.reset();
          } catch (error) {
            console.log(error);
            this.expenseForm.reset();
          }
        },
        (error) => {
          if (error.error.messege) {
            alert(error.error.messege);
            this.expenseForm.reset();
          } else {
            alert('something went wrong plase');
          }
        }
      );
  }

  getExpense() {
    this.http
      .get(
        'http://localhost:8000/api/v1/CollectiveCoin/user/expenses/get-expenses'
      )
      .subscribe(
        (resultData: ExpenseResponse) => {
          try {
            console.log(resultData);
            this.data = resultData.expenses.map((expense) => ({
              title: expense.title,
              amount: expense.amount,
              category: expense.category,
              date: expense.date,
              type: 'expense',
              id: expense._id,
            }));
            this.amounts = resultData.expenses
              .map((expense) => ({
                amount: expense.amount,
                date: expense.date,
              }))
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                return dateA.getTime() - dateB.getTime();
              });
            this.totalexpense = resultData.totalexpense;
            this.data = this.data.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);

              return dateB.getTime() - dateA.getTime();
            });
            console.log(this.totalexpense);
            this.amountsvalue = this.amounts.map((obj) => obj.amount);
          } catch (error) {
            console.log(error);
          }
        },
        (error) => {
          if (error.error.messege) {
            alert(error.error.messege);
          } else {
            alert('there was problem loading this page please login again ');
            this.router.navigate(['/login']);
          }
          if (error.error.messege === 'please login first') {
            this.router.navigate(['/login']);
          }
        }
      );
  }
  deleteExpense(id) {
    console.log(id);
    this.http
      .delete(
        `http://localhost:8000/api/v1/CollectiveCoin/user/expenses/delete-expense/${id}`
      )
      .subscribe(
        (resultData) => {
          try {
            if (confirm('are you sure you want to delete this expense'))
              console.log(resultData);
            alert('expense deleted successfully');
            this.getExpense();
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
