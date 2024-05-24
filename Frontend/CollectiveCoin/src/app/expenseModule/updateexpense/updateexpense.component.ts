import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExpenseService } from '../../shared/services/expense.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';
import { expense } from '../../shared/interfaces/expense.interface';
@Component({
  selector: 'app-updateexpense',
  templateUrl: './updateexpense.component.html',
  styleUrl: './updateexpense.component.css',
})
export class UpdateexpenseComponent implements OnInit, OnDestroy {
  expenseId = '';
  updateExpenseForm: FormGroup;
  expenseData: expense;
  showCheckbox: boolean = false;

  constructor(
    public expenseservice: ExpenseService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private datepipe: DatePipe,
    private snackBar: MatSnackBar,
    private router: Router
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
        Validators.maxLength(80),
      ]),
      date: new FormControl('', [Validators.required]),
      markAspaid: new FormControl(true, [Validators.required]),
      duedate: new FormControl(''),
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
                markAsPaid: this.expenseData.markAspaid,
                duedate: this.expenseData.duedate,
              });
            } else {
              console.log('Expense data is undefined.');
              this.router.navigate(['/Expense']);
            }
          }
        });
      });
    });
  }

  UpdateExpense(id: string): Observable<any> {
    return new Observable((obseraver) => {
      let bodyData = this.updateExpenseForm.value;
      if (confirm('are you sure you want to update this expense')) {
        this.http
          .patch(`${environment.expenseApiUrl}/update-expense/${id}`, bodyData)
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
  onCategoryChange(event: any) {
    const selectedCategory = event.target.value.trim();
    console.log('Selected Category:', selectedCategory);
    console.log('Is Monthly Bills?', selectedCategory === 'monthlybills');
    this.showCheckbox = selectedCategory === 'monthlybills';
  }

  showMessage(message: string) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }

  ngOnDestroy(): void {
    this.updateExpenseForm.reset();
  }
}
