import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { selectIncomeById } from '../incomeStore/income.selector';
import { IncomeState } from '../incomeStore/income.reducer';
import { income } from '../../shared/interfaces/income.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { loadIncomes } from '../incomeStore/income.actions';

@Component({
  selector: 'app-updateincome',
  templateUrl: './updateincome.component.html',
  styleUrls: ['./updateincome.component.css'],
})
export class UpdateincomeComponent implements OnInit, OnDestroy {
  incomeId = '';
  updateIncomeForm: FormGroup;
  incomeData$: Observable<income>;
  incomeDataSubscription: Subscription;
  incomeData: income;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private store: Store<IncomeState>,
    private http: HttpClient,
    private router: Router
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
        Validators.maxLength(80),
      ]),
      date: new FormControl('', [Validators.required]),
    });

    this.route.params.subscribe((params) => {
      this.incomeId = params['id'];

      this.incomeData$ = this.store.select(selectIncomeById(this.incomeId));

      this.incomeDataSubscription = this.incomeData$.subscribe((incomeData) => {
        if (incomeData) {
          this.incomeData = incomeData;
          this.updateIncomeForm.patchValue({
            title: incomeData.title,
            amount: incomeData.amount,
            category: incomeData.category,
            description: incomeData.description,
            date: incomeData.date,
          });
        } else {
          console.log('Income data not found.');
          this.router.navigate(['/Income']);
        }
      });
    });
  }

  Updateincome(id: any): void {
    let bodyData = this.updateIncomeForm.value;
    console.log(bodyData);
    if (confirm('Are you sure you want to update this income?')) {
      this.http
        .patch(`${environment.incomeApiUrl}/update-income/${id}`, bodyData)
        .subscribe(
          (resultData) => {
            try {
              this.showMessage('Income updated successfully');
              this.store.dispatch(loadIncomes());
              console.log(resultData);
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
                'Something went wrong. Please try again after some time.'
              );
            }
          }
        );
    }
  }

  save(): void {
    console.log('Button is clicked');
    if (this.updateIncomeForm.valid && this.incomeData) {
      this.Updateincome(this.incomeId);
    } else {
      this.showMessage('Please fill the form as directed.');
    }
  }

  showMessage(message: string): void {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }

  ngOnDestroy(): void {
    if (this.incomeDataSubscription) {
      this.incomeDataSubscription.unsubscribe();
    }
    this.updateIncomeForm.reset();
  }
}
