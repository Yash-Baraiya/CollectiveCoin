import { Injectable } from '@angular/core';
import { IncomeResponse } from '../interfaces/income.interface';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  incomeForm: FormGroup;
  date: Date = new Date();
  data: any = [];
  incamounts: any = [];
  totalIncome: number = 0;

  yearlyTotalIncome: number;
  constructor(
    private http: HttpClient,
    private router: Router,
    private datepipe: DatePipe,
    private snackBar: MatSnackBar
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
    this.http
      .post(`${environment.incomeApiUrl}/add-income`, bodyData)
      .subscribe(
        (resultData) => {
          console.log(resultData);
          this.showMessage('income added successfully');
          this.getIncome().subscribe(() => {
            console.log('add income subscribe is getting called');
          });
          this.incomeForm.reset();
        },
        (error) => {
          if (error.error.message) {
            this.showMessage(error.error.message);
            this.incomeForm.reset();
          } else {
            console.log(error);
            this.showMessage('somthing went wrong');
          }
        }
      );
  }
  getIncome(): Observable<any> {
    return new Observable((obseraver) => {
      this.http.get(`${environment.incomeApiUrl}/get-incomes`).subscribe(
        (resultData: IncomeResponse) => {
          console.log(resultData.monthlyincome);
          this.data = resultData.monthlyincome.map((income: any) => ({
            title: income.title,
            category: income.category,
            amount: income.amount,
            date: this.datepipe.transform(income.date, 'MM/dd/yyyy'),
            id: income._id,
            description: income.description,
            addedBy: income.addedBy,
            type: income.type,
          }));
          this.yearlyTotalIncome =
            resultData.yearlyTotalincome[0].yearlyTotalincome;
          this.totalIncome = resultData.totalincome[0].totalincome;

          this.incamounts = resultData.monthlyincome
            .map((income) => ({
              amount: income.amount[0],
              date: this.datepipe.transform(income.date, 'dd/MM/yyyy'),
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

          obseraver.next();
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

  deleteIncome(id) {
    if (confirm('are you sure you want to delete this income')) {
      this.http
        .delete(`${environment.incomeApiUrl}/delete-income/${id}`)
        .subscribe(
          (resultData) => {
            console.log(resultData);
            this.showMessage('income deleted successfully');
            this.getIncome();
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

  //method for showing alert message
  showMessage(message: any) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
