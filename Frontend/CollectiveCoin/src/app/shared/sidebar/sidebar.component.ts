import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { myTheme } from '../../../environments/environment';
import { LoginDataService } from '../login-data.service';
import { FormGroup } from '@angular/forms';

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
  photo: any = '';
  myTheme = myTheme;

  constructor(
    private router: Router,
    private loginDataService: LoginDataService
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
    this.photo = this.data.data.user.photo;
    console.log('user photo string is', this.photo);
  }

  clearStorage() {
    console.log('click happened');
    localStorage.clear();
  }
}
