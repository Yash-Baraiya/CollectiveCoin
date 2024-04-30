import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import ExpenseResponse from './expense.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Stripe } from 'stripe';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  expenseForm: FormGroup;
  date: Date = new Date();
  data: any = [];
  expamounts: any = [];
  amountsvalue: Array<number> = [];
  totalexpense: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private datepipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
    this.expenseForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(40),
      ]),
      date: new FormControl('', [Validators.required]),
      markAspaid: new FormControl(true, [Validators.required]),
      duedate: new FormControl(''),
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

            this.showMessage('expense added successfully');
            this.getExpense().subscribe(() => {
              console.log('getting expense again');
            });
            this.expenseForm.reset();
          } catch (error) {
            console.log(error);
            this.expenseForm.reset();
          }
        },
        (error) => {
          if (error.error.messege) {
            this.showMessage(error.error.messege);
            this.expenseForm.reset();
          } else {
            this.showMessage('something went wrong plase');
          }
        }
      );
  }

  getExpense(): Observable<any> {
    return new Observable((obseraver) => {
      this.http
        .get(
          'http://localhost:8000/api/v1/CollectiveCoin/user/expenses/get-expenses'
        )
        .subscribe(
          (resultData: ExpenseResponse) => {
            try {
              console.log(resultData);
              this.data = resultData.monthlyexpense.map((expense) => ({
                title: expense.title,
                amount: expense.amount,
                category: expense.category,
                date: this.datepipe.transform(expense.date, 'MM/dd/yyyy'),
                type: 'expense',
                id: expense._id,
                description: expense.description,
                addedBy: expense.addedBy,
                markAspaid: expense.markAspaid,
                duedate: this.datepipe.transform(expense.duedate, 'MM/dd/yyyy'),
                paidBy: expense.paidBy,
              }));
              this.expamounts = resultData.monthlyexpense
                .map((expense) => ({
                  amount: expense.amount,
                  date: this.datepipe.transform(expense.date, 'dd/MM/yyyy'),
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
              this.amountsvalue = this.expamounts.map((obj) => obj.amount);
              obseraver.next();
            } catch (error) {
              console.log(error);
            }
          },
          (error) => {
            if (error.error.messege) {
              this.showMessage(error.error.messege);
            } else {
              this.showMessage(
                'there was problem loading this page please login again '
              );
              this.router.navigate(['/login']);
            }
            if (error.error.messege === 'please login first') {
              this.router.navigate(['/login']);
            }
          }
        );
    });
  }
  deleteExpense(id) {
    if (confirm('are you sure you want to delete this expense')) {
      this.http
        .delete(
          `http://localhost:8000/api/v1/CollectiveCoin/user/expenses/delete-expense/${id}`
        )
        .subscribe(
          (resultData) => {
            try {
              console.log(resultData);
              this.showMessage('expense deleted successfully');
              this.getExpense().subscribe(() => {
                console.log('getting expense again');
              });
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
  }
  private loadStripe(): Promise<Stripe> {
    return (window as any).Stripe(
      'pk_test_51P7XldSCqlnBTgeBDXQpbvdF3fgScPKDMNyjmtwTu2BWasJkUtuJvtEodSTEE9akM6eaW4mADMNjzuV78nwPLOxX00e8uBseJH'
    );
  }
  payment(id: any) {
    console.log('button clicked');

    this.http
      .post(
        `http://localhost:8000/api/v1/CollectiveCoin/user/expenses/billpayment/${id}`,
        {}
      )
      .subscribe(
        (resultData: any) => {
          try {
            const rediretLink = resultData.link;
            window.location.href = rediretLink;
          } catch (error) {
            console.log(error);
          }
        },
        (error) => {
          console.log(error);
          if (error.status === 303) {
            const redirectUrl = error.error.link;
            window.location.href = redirectUrl;
          } else if (error.error.message) {
            alert(error.error.message);
          } else {
            alert('There was a problem loading this page. Please login again.');
            //this.router.navigate(['/login']);
          }
          if (error.error.message === 'Please login first') {
            this.router.navigate(['/login']);
          }
        }
      );
  }
  showMessage(message: any) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
