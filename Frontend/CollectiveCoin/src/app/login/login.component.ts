import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { LoginDataService } from '../shared/login-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AnimateTimings } from '@angular/animations';

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
  isLoggedin = new BehaviorSubject<boolean>(false);
  data: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginDataServeice: LoginDataService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
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

  openbox() {
    console.log('button is clicked');
    document.getElementById('exampleModal').style.display = 'block';
    document.getElementById('exampleModal').style.opacity = '1';
  }
  closebox() {
    console.log('button is clicked');
    document.getElementById('exampleModal').style.display = 'none';
  }
  login() {
    let bodyData = this.loginForm.value;

    this.http
      .post('http://localhost:8000/api/v1/CollectiveCoin/user/login', bodyData)
      .subscribe(
        (resultData: any) => {
          if (resultData) {
            try {
              this.isLoggedin.next(true);
              this.loginDataServeice.setData(resultData);

              alert('logged in successfully');
              this.router.navigate(['/DashBoard']);
            } catch (error) {
              console.log(error);
              alert(resultData.error.message);
            }
          }
        },
        (error) => {
          console.log(error);
          if (error.error.message) {
            console.log(error.error.message);
            alert(error.error.message);
            this.router.navigate(['/login']);
          } else {
            alert('An error occurred. Please try again later.');
          }
        }
      );
  }

  forgotpassword() {
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
          this.closebox();
          alert(this.data.messege);
        },
        (error) => {
          console.log(error);

          if (error.error.messege) {
            this.closebox();
            alert(error.error.messege);
          } else {
            this.closebox();
            alert(
              'there was a problem sending the mail please try agian after some time'
            );
          }
        }
      );
  }

  save() {
    if (this.loginForm.valid) {
      this.login();
    } else {
      alert('please fill the form as directed');
    }
  }
}
