import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginDataService } from '../shared/login-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginDataService: LoginDataService
  ) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      role: new FormControl('user', [Validators.required]),
      isEarning: new FormControl('false', [Validators.required]),
      familycode: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]),
      photo: new FormControl('', Validators.required),
    });
  }

  register() {
    const bodyData = this.signupForm.value;
    const photo = this.signupForm.get('photo').value;

    this.http
      .post('http://localhost:8000/api/v1/CollectiveCoin/user/signup', bodyData)
      .subscribe(
        (resultData: any) => {
          this.loginDataService.setData(resultData);
          alert('Signed up successfully');
          this.router.navigate(['/DashBoard']);
        },
        (error) => {
          if (error.error.message) {
            console.log(error.error.message);
            alert(error.error.message); // Adjust this message as needed
          } else {
            alert('An error occurred. Please try again later.'); // General error message
          }
        }
      );
  }

  save() {
    if (this.signupForm.valid) {
      this.register();
    } else {
      alert('please fill the form as directed');
    }
  }
}
