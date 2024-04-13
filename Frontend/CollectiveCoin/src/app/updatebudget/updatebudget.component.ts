import { Component } from '@angular/core';
import { BudgetService } from '../budget/budget.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-updatebudget',
  templateUrl: './updatebudget.component.html',
  styleUrl: './updatebudget.component.css',
})
export class UpdatebudgetComponent {
  budgetId = '';
  updateBudgetForm: FormGroup;
  budgetData: any = {};

  constructor(
    public budgetservice: BudgetService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private datepipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.budgetId = param['id'];
      this.budgetservice.getBudgets().subscribe(() => {
        this.budgetservice.data.forEach((budget) => {
          if (budget.id === this.budgetId) {
            this.budgetData = budget;
            console.log(this.budgetData);

            if (this.budgetData) {
              this.updateBudgetForm.patchValue({
                title: this.budgetData.title,
                amount: this.budgetData.amount,
                category: this.budgetData.category,
                description: this.budgetData.description,
                date: this.datepipe.transform(
                  this.budgetData.date,
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
    this.updateBudgetForm = new FormGroup({
      title: new FormControl(this.budgetData.title, [Validators.required]),
      amount: new FormControl(this.budgetData.amount, [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      category: new FormControl(this.budgetData.category, [
        Validators.required,
      ]),
      description: new FormControl(this.budgetData.description, [
        Validators.required,
        Validators.maxLength(40),
      ]),
      date: new FormControl(this.budgetData.date, [Validators.required]),
    });
  }
  ngOnDestroy(): void {
    this.budgetData = {};
  }

  Updateincome(id: any): Observable<any> {
    return new Observable((obseraver) => {
      let bodyData = this.updateBudgetForm.value;
      if (confirm('are you sure you want to update this Budget')) {
        this.http
          .patch(
            `http://localhost:8000/api/v1/CollectiveCoin/user/budget/update-budget/${id}`,
            bodyData
          )
          .subscribe(
            (resultData) => {
              try {
                alert('Budget updated successfully');
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
    if (this.updateBudgetForm.valid) {
      this.Updateincome(this.budgetId).subscribe(() => {
        this.budgetservice.getBudgets().subscribe(() => {
          this.budgetservice.data.forEach((budget) => {
            if (budget.id === this.budgetId) {
              this.budgetData = budget;
              console.log(this.budgetData);
            }
          });
        });
      });
    } else {
      alert('please fill form as directed');
    }
  }
}
