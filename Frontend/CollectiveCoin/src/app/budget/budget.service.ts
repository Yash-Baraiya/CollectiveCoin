import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import BudgetResponse from './budget.interface';
import { Observable } from 'rxjs';
//import { BarCartComponent } from '../bar-cart/bar-cart.component';

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
  constructor(private http: HttpClient, private router: Router) {
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

  ngOnInit(): void {
    this.getBudgets();
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
            console.log(resultData);
            alert('budget created successfully');
            this.getBudgets().subscribe(() => {
              console.log('getting budgets');
              //this.barchart.createChart();
            });
            this.budgetForm.reset();
          } catch (error) {
            console.log(error);
            this.budgetForm.reset();
          }
        },
        (error) => {
          if (error.error.message) {
            alert(error.error.message);
            this.budgetForm.reset();
          } else {
            console.log(error);
            alert('somthing went wrong');
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
                date: budget.date.split('T')[0],
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
              alert('income deleted successfully');
              this.getBudgets();
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
}
