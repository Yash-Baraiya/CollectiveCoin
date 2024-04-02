import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  data: any;

  constructor() {}

  setData(parsedData: any) {
    this.data = parsedData;
    //console.log(this.data);
    localStorage.setItem('loginToken', this.data.token);
    console.log(this.data.token);
  }

  getData() {
    console.log(this.data.data.user);
    return this.data;
  }
}
