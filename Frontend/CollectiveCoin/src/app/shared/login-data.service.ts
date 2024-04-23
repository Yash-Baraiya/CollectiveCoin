import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  data: any;

  constructor() {}

  setData(parsedData: any) {
    this.data = parsedData;
    console.log(this.data);
    localStorage.setItem('loginToken', this.data.token);
    localStorage.setItem('username', this.data.data.user.name);
    localStorage.setItem('photo', this.data.data.user.photo);
    localStorage.setItem('isEarning', this.data.data.user.isEarning);
    console.log(this.data.token);
  }

  getData() {
    console.log(this.data.data.user);
    return this.data;
  }
}
