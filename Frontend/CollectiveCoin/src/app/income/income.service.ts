import { Injectable } from '@angular/core';
import IncomeResponse from './income.interface';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  incomeForm: FormGroup;
  date: Date = new Date();
  data: any = [];
  incamounts: any = [];
  totalIncome: number = 0;
  amountsvalue: Array<number> = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private datepipe: DatePipe
  ) {
    this.incomeForm = new FormGroup({
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
    this.getIncome();
  }
  addIncome() {
    let bodyData = this.incomeForm.value;
    let selecteddate = this.incomeForm.get('date').value;

    let formateddate = this.datepipe.transform(selecteddate, 'yyyy-MM-dd');

    bodyData.date = formateddate;
    console.log(formateddate);
    console.log(bodyData.date);
    this.http
      .post(
        'http://localhost:8000/api/v1/CollectiveCoin/user/incomes/add-income',
        bodyData
      )
      .subscribe(
        (resultData) => {
          try {
            console.log(resultData);
            alert('income added successfully');
            this.getIncome().subscribe(() => {
              console.log('add income subscribe is getting called');
            });
            this.incomeForm.reset();
          } catch (error) {
            console.log(error);
            this.incomeForm.reset();
          }
        },
        (error) => {
          if (error.error.message) {
            alert(error.error.message);
            this.incomeForm.reset();
          } else {
            console.log(error);
            alert('somthing went wrong');
          }
        }
      );
  }
  getIncome(): Observable<any> {
    return new Observable((obseraver) => {
      this.http
        .get(
          'http://localhost:8000/api/v1/CollectiveCoin/user/incomes/get-incomes'
        )
        .subscribe(
          (resultData: IncomeResponse) => {
            try {
              console.log('get income is getting called');
              this.data = resultData.monthlyincome.map((income: any) => ({
                title: income.title,
                category: income.category,
                amount: income.amount,
                date: income.date.split('T')[0],
                id: income._id,
                description: income.description,
                addedBy: income.addedBy,
              }));
              this.totalIncome = resultData.totalincome;

              this.incamounts = resultData.monthlyincome
                .map((income) => ({
                  amount: income.amount[0],
                  date: income.date
                    .toString()
                    .slice(0, 10)
                    .split('-')
                    .reverse()
                    .join('/'),
                }))
                .sort((a, b) => {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);

                  return dateA.getTime() - dateB.getTime();
                });
              console.log('coming from getincome', this.incamounts);
              this.data = this.data.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                return dateB.getTime() - dateA.getTime();
              });
              this.amountsvalue = this.incamounts.map((obj) => obj.amount);
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

  deleteIncome(id) {
    if (confirm('are you sure you want to delete this income')) {
      this.http
        .delete(
          `http://localhost:8000/api/v1/CollectiveCoin/user/incomes/delete-income/${id}`
        )
        .subscribe(
          (resultData) => {
            try {
              console.log(resultData);
              alert('income deleted successfully');
              this.getIncome();
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
