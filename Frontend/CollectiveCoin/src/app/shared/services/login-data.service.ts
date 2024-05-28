import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environment';
import resultData from '../interfaces/resultData.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  data: resultData;
  role: string;
  username: string;
  photo: string;
  isEarning: boolean;
  priority: number;
  email: string;

  photoSubject = new BehaviorSubject<string>(null);
  nameSubject = new BehaviorSubject<string>(null);
  photo$ = this.photoSubject.asObservable();
  name$ = this.nameSubject.asObservable();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  //method for setting the user's data to local storange
  setData(parsedData: resultData) {
    this.data = parsedData;

    this.role = this.data.data.user.role;
    this.username = this.data.data.user.name;
    this.photo = this.data.data.user.photo;
    this.isEarning = this.data.data.user.isEarning;
    this.priority = this.data.data.user.priority;
    this.email = this.data.data.user.email;

    this.photoSubject.next(this.photo);
    this.nameSubject.next(this.username);

    if (this.data.token) {
      localStorage.setItem('loginToken', this.data.token);
    }
  }

  //method for getting the user

  isLoggedin(): Observable<any> {
    return new Observable((observer) => {
      this.http.get(`${environment.userApiUrl}/isloggedin`).subscribe(
        (resultData: resultData) => {
          this.setData(resultData);
          observer.next();
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/login']);
          if (error.error.message) {
            this.showMessage(error.error.message);
          } else {
            this.showMessage(
              'Something went wrong. Please try again after some time.'
            );
          }
        }
      );
    });
  }

  showMessage(message: string): void {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
