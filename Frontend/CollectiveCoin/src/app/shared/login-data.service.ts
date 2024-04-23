import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  data: any;

  constructor() {}

  setData(parsedData: any) {
    this.data = parsedData;
   
    localStorage.setItem('loginToken', this.data.token);
    console.log(this.data.token);
  }

  getData() {
    console.log(this.data.data.user);
    return this.data;
  }
}
