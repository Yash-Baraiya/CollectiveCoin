import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  data: any;
  role: any;
  username: any;
  photo: any;
  isEarning: any;
  priority: any;
  email: any;
  constructor(private http: HttpClient) {}

  //method for setting the user's data to local storange
  setData(parsedData: any) {
    this.data = parsedData;
    console.log(this.data);
    this.role = this.data.data.user.role;
    this.username = this.data.data.user.name;
    this.photo = this.data.data.user.photo;
    this.isEarning = this.data.data.user.isEarning;
    this.priority = this.data.data.user.priority;
    this.email = this.data.data.user.email;

    if (this.data.token) {
      localStorage.setItem('loginToken', this.data.token);
    }
  }

  //method for getting the user
  getData() {
    return this.data;
  }

  isLoggedin(): Observable<any> {
    return new Observable((observer) => {
      this.http
        .get('http://localhost:8000/api/v1/CollectiveCoin/user/isloggedin')
        .subscribe((resultData) => {
          console.log('is logged in result data', resultData);
          this.setData(resultData);
          observer.next();
        });
    });
  }
}
