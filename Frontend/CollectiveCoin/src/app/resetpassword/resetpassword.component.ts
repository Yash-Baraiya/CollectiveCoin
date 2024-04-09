import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css',
})
export class ResetpasswordComponent {
  passwordreset: FormGroup;
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.passwordreset = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      otp: new FormControl('', Validators.required),
    });
  }

  resetpassword() {
    if (this.passwordreset.valid) {
      let bodyData = this.passwordreset.value;
      let token = '';
      this.activatedRoute.params.forEach((param) => {
        token = param['token'];
      });

      this.http
        .patch(
          `http://localhost:8000/api/v1/CollectiveCoin/user/resetPassword/${token}`,
          bodyData
        )
        .subscribe(
          (resultData: any) => {
            if (resultData) {
              try {
                alert('password reseted successfully');
                this.router.navigate(['/login']);
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
    } else {
      alert('please fill the form correctly');
    }
  }

  save() {
    if (this.passwordreset.valid) {
      this.resetpassword();
    } else {
      alert('please fill the form as directed');
    }
  }
}
