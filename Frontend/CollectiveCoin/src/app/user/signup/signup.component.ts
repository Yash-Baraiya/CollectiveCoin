import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginDataService } from '../../shared/services/login-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';

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
    private loginDataService: LoginDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
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
      photo: new FormControl(null, Validators.required),
    });
  }

  register() {
    const formData = new FormData();

    formData.append('name', this.signupForm.get('name').value);
    formData.append('email', this.signupForm.get('email').value);
    formData.append('password', this.signupForm.get('password').value);

    formData.append('familycode', this.signupForm.get('familycode').value);

    const photoFile = this.signupForm.get('photo').value;
    formData.append('photo', photoFile);

    this.http.post(`${environment.userApiUrl}/signup`, formData).subscribe(
      (resultData: any) => {
        if (resultData.status === 'success') {
          this.loginDataService.setData(resultData);
          this.showMessage('signedUp successfully');
          this.router.navigate(['/DashBoard']);
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

  openPopup() {
    document.getElementById('popupsection').style.display = 'flex';
    document.getElementById('overlay').style.display = 'block';
  }

  closePopup() {
    document.getElementById('popupsection').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }

  showMessage(message: string) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
