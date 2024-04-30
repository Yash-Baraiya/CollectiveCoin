import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExpenseService } from '../expense/expense.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-updateexpense',
  templateUrl: './updateexpense.component.html',
  styleUrl: './updateexpense.component.css',
})
export class UpdateexpenseComponent implements OnInit, OnDestroy {
  expenseId = '';
  updateExpenseForm: FormGroup;
  expenseData: any = {};

  constructor(
    public expenseservice: ExpenseService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private datepipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.updateExpenseForm = new FormGroup({
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
      this.expenseId = param['id'];
      this.expenseservice.getExpense().subscribe(() => {
        this.expenseservice.data.forEach((expense) => {
          if (expense.id === this.expenseId) {
            this.expenseData = expense;
            if (this.expenseData) {
              this.updateExpenseForm.patchValue({
                title: this.expenseData.title,
                amount: this.expenseData.amount,
                category: this.expenseData.category,
                description: this.expenseData.description,
                date: this.datepipe.transform(
                  this.expenseData.date,
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
    this.expenseData = {};
  }

  UpdateExpense(id: any): Observable<any> {
    return new Observable((obseraver) => {
      let bodyData = this.updateExpenseForm.value;
      if (confirm('are you sure you want to update this expense')) {
        this.http
          .patch(
            `http://localhost:8000/api/v1/CollectiveCoin/user/expenses/update-expense/${id}`,
            bodyData
          )
          .subscribe(
            (resultData) => {
              try {
                this.showMessage('expense updated successfully');

                console.log(resultData);
                obseraver.next();
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
    });
  }

  save() {
    if (this.updateExpenseForm.valid) {
      this.UpdateExpense(this.expenseId).subscribe(() => {
        this.expenseservice.getExpense().subscribe(() => {
          this.expenseservice.data.forEach((expense) => {
            if (expense.id === this.expenseId) {
              this.expenseData = expense;
              console.log(this.expenseData);
            }
          });
        });
      });
    } else {
      this.showMessage('please fill form as directed');
    }
  }
  showMessage(message: any) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
