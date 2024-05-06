import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import BudgetResponse from '../../budgetModule/budget.interface';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  budgetForm: FormGroup;

  date: Date = new Date();
  data: any = [];
  amounts: any = [];
  totalIncome: number = 0;
  amountsvalue: Array<number> = [];
  overbudget: Array<any> = [];
  underbudget: Array<any> = [];
  expcategoryAmounts: object = {};
  constructor(
    private http: HttpClient,
    private router: Router,
    private datepipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
    this.budgetForm = new FormGroup({
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
    });
  }
  addBudget() {
    let bodyData = this.budgetForm.value;
    console.log(bodyData);
    this.http
      .post(
        'http://localhost:8000/api/v1/CollectiveCoin/user/budget/add-budget',
        bodyData
      )
      .subscribe(
        (resultData) => {
          try {
            this.showMessage('budget created successfully');
            this.getBudgets().subscribe(() => {
              console.log('getting budgets');
            });
            this.budgetForm.reset();
          } catch (error) {
            console.log(error);
            this.budgetForm.reset();
          }
        },
        (error) => {
          if (error.error.message) {
            this.showMessage(error.error.message);
            this.budgetForm.reset();
          } else {
            console.log(error);
            this.showMessage('somthing went wrong');
          }
        }
      );
  }
  getBudgets(): Observable<any> {
    return new Observable((obseraver) => {
      this.http
        .get(
          'http://localhost:8000/api/v1/CollectiveCoin/user/budget/get-budgets'
        )
        .subscribe(
          (resultData: BudgetResponse) => {
            try {
              this.data = resultData.monthlybudget.map((budget: any) => ({
                title: budget.title,
                category: budget.category,
                amount: budget.amount,
                date: this.datepipe.transform(budget.date, 'MM/dd/yyyy'),
                id: budget._id,
                description: budget.description,
                createdBy: budget.CreatedBy,
              }));
              this.overbudget = resultData.overbudget;
              this.underbudget = resultData.underbudget;
              this.expcategoryAmounts = resultData.expcategoryAmounts;
              console.log(this.expcategoryAmounts);
              this.amounts = resultData.monthlybudget
                .map((budget) => ({
                  amount: budget.amount,
                  date: budget.date,
                  category: budget.category,
                }))
                .sort((a, b) => {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);

                  return dateA.getTime() - dateB.getTime();
                });
              this.data = this.data.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                return dateB.getTime() - dateA.getTime();
              });
              this.amountsvalue = this.amounts.map((obj) => obj.amount);
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

  deleteBudget(id) {
    if (confirm('are you sure you want to delete this budget')) {
      this.http
        .delete(
          `http://localhost:8000/api/v1/CollectiveCoin/user/budget/delete-budget/${id}`
        )
        .subscribe(
          (resultData) => {
            try {
              console.log(resultData);
              this.showMessage('budget deleted successfully');
              this.getBudgets().subscribe();
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

  //showing alert  message using angular material
  showMessage(message: any) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}