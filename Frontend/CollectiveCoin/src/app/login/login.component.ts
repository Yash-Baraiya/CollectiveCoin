import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDataService } from '../shared/login-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  data: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginDataServeice: LoginDataService,
    private snackBar: MatSnackBar
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

  openbox2() {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';
  }
  closebox2() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }
  login() {
    console.log('login button clicked');
    let bodyData = this.loginForm.value;

    this.http
      .post('http://localhost:8000/api/v1/CollectiveCoin/user/login', bodyData)
      .subscribe(
        (resultData: any) => {
          if (resultData) {
            try {
              this.loginDataServeice.setData(resultData);

              this.showMessage('loggedin successfully');
              this.router.navigate(['/DashBoard']);
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
        .post(
          'http://localhost:8000/api/v1/CollectiveCoin/user/forgotpassword',
          bodyData
        )
        .subscribe(
          (resultData) => {
            console.log(resultData);
            this.data = resultData;
            const token = this.data.resetToken;
            this.closebox2();
            this.showMessage(this.data.messege);
          },
          (error) => {
            console.log(error);

            if (error.error.messege) {
              this.closebox2();
              this.showMessage(error.error.message);
            } else {
              this.closebox2();
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
  showMessage(message: any) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
