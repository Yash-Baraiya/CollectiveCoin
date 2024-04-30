import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  imageform: FormGroup;
  data: any;
  name: string = '';
  photo: any = '';

  constructor(private router: Router) {
    this.name = localStorage.getItem('username');
    this.photo = localStorage.getItem('photo');
  }

  isActive(Route: string) {
    return this.router.isActive(Route, true);
  }

  ngOnInit(): void {}

  clearStorage() {
    localStorage.clear();
  }
}
