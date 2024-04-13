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
      photo: new FormControl(null, Validators.required),
    });
  }

  register() {
    const formData = new FormData();

    formData.append('name', this.signupForm.get('name').value);
    formData.append('email', this.signupForm.get('email').value);
    formData.append('password', this.signupForm.get('password').value);
    formData.append('role', this.signupForm.get('role').value);
    formData.append('isEarning', this.signupForm.get('isEarning').value);
    formData.append('familycode', this.signupForm.get('familycode').value);

    // Append the photo file separately
    const photoFile = this.signupForm.get('photo').value;
    formData.append('photo', photoFile);

    this.http
      .post('http://localhost:8000/api/v1/CollectiveCoin/user/signup', formData)
      .subscribe(
        (resultData: any) => {
          this.loginDataService.setData(resultData);
          alert('Signed up successfully');
          this.router.navigate(['/DashBoard']);
        },
        (error) => {
          if (error.error.message) {
            console.log(error.error.message);
            alert(error.error.message);
          } else {
            alert('An error occurred. Please try again later.');
          }
        }
      );
  }
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.signupForm.get('photo').setValue(file);
    }
  }

  save() {
    if (this.signupForm.valid) {
      this.register();
    } else {
      alert('please fill the form as directed');
    }
  }
}
