import { Component, OnDestroy, OnInit } from '@angular/core';
import { IncomeService } from '../income/income.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-updateincome',
  templateUrl: './updateincome.component.html',
  styleUrl: './updateincome.component.css',
})
export class UpdateincomeComponent implements OnInit, OnDestroy {
  incomeId = '';
  updateIncomeForm: FormGroup;
  incomeData: any = {};

  constructor(
    public incomeservice: IncomeService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private datepipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.updateIncomeForm = new FormGroup({
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

    this.route.params.subscribe((param) => {
      this.incomeId = param['id'];
      this.incomeservice.getIncome().subscribe(() => {
        this.incomeservice.data.forEach((income) => {
          if (income.id === this.incomeId) {
            this.incomeData = income;
            console.log(this.incomeData);
            if (this.incomeData) {
              this.updateIncomeForm.patchValue({
                title: this.incomeData.title,
                amount: this.incomeData.amount,
                category: this.incomeData.category,
                description: this.incomeData.description,
                date: this.datepipe.transform(
                  this.incomeData.date,
                  'MM/dd/yyyy'
                ),
              });
            } else {
              console.log('Budget data is undefined.');
            }
          }
        });
      });
    });
  }
  ngOnDestroy(): void {
    this.incomeData = {};
  }

  Updateincome(id: any): Observable<any> {
    return new Observable((obseraver) => {
      let bodyData = this.updateIncomeForm.value;
      if (confirm('are you sure you want to update this income')) {
        this.http
          .patch(
            `http://localhost:8000/api/v1/CollectiveCoin/user/incomes/update-income/${id}`,
            bodyData
          )
          .subscribe(
            (resultData) => {
              try {
                alert('income updated successfully');
                //this.router.navigate(['Income']);
                console.log(resultData);
                obseraver.next();
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
    });
  }

  save() {
    console.log('button is clicked');
    if (this.updateIncomeForm.valid) {
      this.Updateincome(this.incomeId).subscribe(() => {
        this.incomeservice.getIncome().subscribe(() => {
          this.incomeservice.data.forEach((income) => {
            if (income.id === this.incomeId) {
              this.incomeData = income;
              console.log(this.incomeData);
            }
          });
        });
      });
    } else {
      alert('please fill form as directed');
    }
  }
}
