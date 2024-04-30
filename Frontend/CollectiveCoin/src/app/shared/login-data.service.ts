import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  data: any;

  constructor() {}

  //method for setting the user's data to local storange
  setData(parsedData: any) {
    this.data = parsedData;
    console.log(this.data);
    localStorage.setItem('loginToken', this.data.token);
    localStorage.setItem('username', this.data.data.user.name);
    localStorage.setItem('photo', this.data.data.user.photo);
    localStorage.setItem('isEarning', this.data.data.user.isEarning);
    console.log(this.data.token);
  }

  //method for getting the user
  getData() {
    console.log(this.data.data.user);
    return this.data;
  }
}
