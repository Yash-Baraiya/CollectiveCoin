import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../environment';
import resultData from '../shared/interfaces/resultData.interface';

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
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
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
        .patch(`${environment.userApiUrl}/resetPassword/${token}`, bodyData)
        .subscribe(
          (resultData: resultData) => {
            if (resultData.status === 'success') {
              this.showMessage('password reseted successfully');
              this.router.navigate(['/login']);
            } else {
              this.showMessage(resultData.messege);
            }
          },
          (error) => {
            console.log(error);
            if (error.message) {
              console.log(error.error.messege);
              this.showMessage(error.messege);
            } else {
              this.showMessage('An error occurred. Please try again later.');
            }
          }
        );
    } else {
      this.showMessage('please fill the form correctly');
    }
  }

  save() {
    if (this.passwordreset.valid) {
      this.resetpassword();
    } else {
      this.showMessage('please fill the form as directed');
    }
  }
  showMessage(message: string) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
