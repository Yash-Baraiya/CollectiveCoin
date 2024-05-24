import { Component, OnDestroy, OnInit } from '@angular/core';
import { BudgetService } from '../../shared/services/budget.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';
import { budget } from '../../shared/interfaces/budget.interface';
import { BudgetState } from '../budgetStore/budget.reducer';
import { Store } from '@ngrx/store';
import { selectBudgetById } from '../budgetStore/budget.selector';
import * as BudgetActions from './../budgetStore/budget.actions';

@Component({
  selector: 'app-updatebudget',
  templateUrl: './updatebudget.component.html',
  styleUrl: './updatebudget.component.css',
})
export class UpdatebudgetComponent implements OnInit, OnDestroy {
  budgetId = '';
  updateBudgetForm: FormGroup;
  budgetData: any = {};
  budgetData$: Observable<budget>;
  budgetDataSubscription: Subscription;

  constructor(
    public budgetservice: BudgetService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private datepipe: DatePipe,
    private snackBar: MatSnackBar,
    private router: Router,
    private store: Store<BudgetState>
  ) {}
  ngOnInit(): void {
    this.store.dispatch(BudgetActions.loadBudgets());
    this.route.params.subscribe((params) => {
      this.budgetId = params['id'];

      this.budgetData$ = this.store.select(selectBudgetById(this.budgetId));

      this.budgetDataSubscription = this.budgetData$.subscribe((budgetData) => {
        if (budgetData) {
          this.budgetData = budgetData;

          this.updateBudgetForm.patchValue({
            title: budgetData.title,
            amount: budgetData.amount,
            category: budgetData.category,
            description: budgetData.description,
            date: budgetData.date,
          });
        } else {
          console.log('Income data not found.');
          this.router.navigate(['/Budget']);
        }
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
        Validators.maxLength(80),
      ]),
      date: new FormControl(this.budgetData.date, [Validators.required]),
    });
  }

  Updatebudget(id: any): Observable<any> {
    return new Observable((obseraver) => {
      let bodyData = this.updateBudgetForm.value;

      if (confirm('are you sure you want to update this Budget')) {
        this.http
          .patch(`${environment.budgetApiUrl}/update-budget/${id}`, bodyData)
          .subscribe(
            (resultData) => {
              this.showMessage('Budget updated successfully');
              this.store.dispatch(BudgetActions.loadBudgets());
              console.log(resultData);
              obseraver.next();
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
    console.log('button is clicked');
    if (this.updateBudgetForm.valid && this.budgetData) {
      this.Updatebudget(this.budgetId).subscribe(() => {});
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
  ngOnDestroy(): void {
    if (this.budgetDataSubscription) {
      this.budgetDataSubscription.unsubscribe();
    }
    this.budgetData = {};
    this.updateBudgetForm.reset();
  }
}
