import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDataService } from '../../shared/services/login-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from '../../shared/services/expense.service';
import { environment } from '../../environment';
import resultData from '../../shared/interfaces/resultData.interface';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { ExpenseState } from '../../expenseModule/expenseStore/expense.reducer';
import * as ExpenseActions from './../../expenseModule/expenseStore/expense.actions';
import { Observable } from 'rxjs';
import { selectExpenseData } from '../../expenseModule/expenseStore/expense.selector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: string = '';
  password: string = '';
  forgotpasswordForm: FormGroup;
  Expenses$: Observable<any>;
  data: resultData;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginDataServeice: LoginDataService,
    private snackBar: MatSnackBar,
    private expenseservice: ExpenseService,
    private store: Store<ExpenseState>,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      ]),
      familycode: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]),
    });

    this.forgotpasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  openbox3(id) {
    const contactForm = this.document.getElementById(id);
    const overlay = this.document.getElementById('overlay');
    if (contactForm && overlay) {
      this.renderer.setStyle(contactForm, 'display', 'block');
      this.renderer.setStyle(contactForm, 'opacity', '1');
      this.renderer.setStyle(overlay, 'display', 'block');
    }
  }
  closebox3(id) {
    const contactForm = this.document.getElementById(id);
    const overlay = this.document.getElementById('overlay');
    if (contactForm && overlay) {
      this.renderer.setStyle(contactForm, 'display', 'none');
      this.renderer.setStyle(contactForm, 'opacity', '1');
      this.renderer.setStyle(overlay, 'display', 'none');
    }
  }
  login() {
    console.log('login button clicked');
    let bodyData = this.loginForm.value;

    this.http.post(`${environment.userApiUrl}/login`, bodyData).subscribe(
      (resultData: any) => {
        if (resultData) {
          try {
            this.loginDataServeice.setData(resultData);

            this.showMessage('loggedin successfully');
            this.router.navigate(['/DashBoard']);

            this.store.dispatch(ExpenseActions.loadExpense({}));

            this.Expenses$ = this.store.select(selectExpenseData);

            this.Expenses$.forEach((expense: any) => {
              if (expense.markAspaid === false) {
                this.showMessage(`some expenses are due to pay `);
              }
            });
          } catch (error) {
            console.log(error);
            this.showMessage(resultData.error.message);
          }
        }
      },
      (error) => {
        console.log(error);
        if (error.error.message) {
          console.log(error.error.message);
          this.showMessage(error.error.message);
          this.router.navigate(['/login']);
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    );
  }

  forgotpassword() {
    console.log('button clicked');
    if (this.forgotpasswordForm.valid) {
      let bodyData = this.forgotpasswordForm.value;
      this.http
        .post(`${environment.userApiUrl}/forgotpassword`, bodyData)
        .subscribe(
          (resultData: resultData) => {
            console.log(resultData);
            this.data = resultData;
            this.closebox3('contactForm');
            this.showMessage(this.data.messege);
          },
          (error) => {
            console.log(error);

            if (error.error.messege) {
              this.closebox3('contactForm');
              this.showMessage(error.error.message);
            } else {
              this.closebox3('contactForm');
              alert(
                'there was a problem sending the mail please try agian after some time'
              );
            }
          }
        );
    } else {
      alert('please fill the form properly');
    }
  }

  save() {
    if (this.loginForm.valid) {
      this.login();
    } else {
      alert('please fill the form as directed');
    }
  }

  //method for showing the alert message
  showMessage(message: any) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
