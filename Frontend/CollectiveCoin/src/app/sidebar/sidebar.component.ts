import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { myTheme } from '../../environments/environment';
import { ThemeToggleService } from '../shared/darkmodeservice.service';
import { LoginDataService } from '../shared/login-data.service';
import { HttpClient } from '@angular/common/http';
import { Form, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  imageform: FormGroup;
  status: boolean = false;
  classStatus = false;
  data: any;
  name: string = '';
  myTheme = myTheme;
  constructor(
    private router: Router,
    public themeToggleService: ThemeToggleService,
    private loginDataService: LoginDataService,
    private http: HttpClient
  ) {}

  isActive(Route: string) {
    return this.router.isActive(Route, true);
  }

  onSwitchClass() {
    this.classStatus = !this.classStatus;
  }

  onDropdownClick(): void {
    this.status = !this.status;
  }

  ngOnInit(): void {
    this.data = this.loginDataService.getData();
    this.name = this.data.data.user.name;
  }

  SwitchMode() {
    if (this.myTheme === 'light') {
      this.myTheme = 'dark';
      console.log(this.data);
    } else {
      this.myTheme = 'light';
    }
    console.log(this.myTheme);
    return this.myTheme;
  }
  uploadimage() {
    let bodydata = this.imageform.value;
    this.http
      .patch('localhost:8000/api/v1/CollectiveCoin/user/uploadimage', bodydata)
      .subscribe((resultData) => {
        try {
          console.log(resultData);
        } catch (error) {
          console.log(error);
        }
      });
  }
  clearStorage() {
    localStorage.clear();
  }
}
