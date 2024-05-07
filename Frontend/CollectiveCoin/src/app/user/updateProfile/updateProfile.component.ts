import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginDataService } from '../../shared/services/login-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updateProfile',
  templateUrl: './updateProfile.component.html',
  styleUrl: './updateProfile.component.css',
})
export class UpdateProfileComponent implements OnInit {
  isEarning: any;
  data: any;
  updateProfileForm: FormGroup;
  updatePasswordForm: FormGroup;
  photo: any;
  username: any;
  email: any;
  constructor(
    private http: HttpClient,
    private loginDataService: LoginDataService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginDataService.isLoggedin().subscribe(() => {
      this.photo = this.loginDataService.photo;
      this.username = this.loginDataService.username;
      this.email = this.loginDataService.email;
    });

    this.updateProfileForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.updateProfileForm.patchValue({
      name: this.loginDataService.username,
      email: this.loginDataService.email,
    });

    this.updatePasswordForm = new FormGroup({
      passwordCurrent: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      ]),
    });
  }

  updateProfile() {
    const formData = this.updateProfileForm.value;

    this.http
      .patch(
        'http://localhost:8000/api/v1/CollectiveCoin/user/updateprofile',
        formData
      )
      .subscribe(
        (resultData: any) => {
          if (resultData.status === 'success') {
            this.loginDataService.isLoggedin().subscribe(() => {
              this.username = this.loginDataService.username;
              this.email = this.loginDataService.email;
            });
            this.showMessage('updated successfully');
          } else {
            this.showMessage(resultData.message);
          }
        },
        (error) => {
          console.log(error);
          if (error.error.message) {
            console.log(error.error.message);
            this, this.showMessage(error.error.message);
          } else {
            alert('An error occurred. Please try again later.');
          }
        }
      );
  }

  updateImage(event: any): void {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    this.http
      .patch(
        'http://localhost:8000/api/v1/CollectiveCoin/user/uploadimage',
        formData
      )
      .subscribe(
        (resultData: any) => {
          console.log(resultData);
          if (resultData.status === 'success') {
            this.loginDataService.isLoggedin().subscribe(() => {
              this.photo = this.loginDataService.photo;
            });
            this.showMessage('Image uploaded successfully');
          } else {
            this.showMessage(resultData.message);
          }
        },
        (error) => {
          console.error('Error uploading image:', error);
          this.showMessage('An error occurred while uploading image');
        }
      );
  }

  updatePassword() {
    const formData = this.updatePasswordForm.value;

    this.http
      .patch(
        'http://localhost:8000/api/v1/CollectiveCoin/user/updatepassword',
        formData
      )
      .subscribe(
        (resultData: any) => {
          console.log(resultData);
          if (resultData.status === 'success') {
            this.loginDataService.setData(resultData);
            this.showMessage('password updated successfully');
          } else {
            this.showMessage(resultData.message);
          }
        },
        (error) => {
          console.log(error);
          if (error.error.message) {
            console.log(error.error.message);
            this, this.showMessage(error.error.message);
          } else {
            alert('An error occurred. Please try again later.');
          }
        }
      );
  }
  showMessage(message: any) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
