import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './memberstore/members.reducer';
import * as MembersActions from './memberstore/members.action';
import { LoginDataService } from '../shared/login-data.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit {
  allmembers$: Observable<any[]>;
  memberrform: FormGroup;
  emailform: FormGroup;
  role: any;
  priority: any;
  loginData: any;

  constructor(
    private store: Store<AppState>,
    private logindataservice: LoginDataService
  ) {}

  ngOnInit(): void {
    this.memberrform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.emailform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(70),
      ]),
    });

    this.role = localStorage.getItem('role');
    this.priority = localStorage.getItem('priority');
    this.allmembers$ = this.store.select((state) => state.members.members);

    this.store.dispatch(MembersActions.loadMembers());
  }

  addmember() {
    console.log('button clicked');
    const bodyData = this.memberrform.value;
    this.store.dispatch(MembersActions.addMember({ member: bodyData }));
    this.closebox();
  }

  deleteMember(id: string) {
    if (
      confirm('Are you sure you want to remove this member from your family?')
    ) {
      console.log(id);
      this.store.dispatch(MembersActions.deleteMember({ id }));
    }
  }

  deletefamily() {
    if (
      confirm(
        'Are you sure you want to delete your whole family? All Your Data will be erased'
      )
    ) {
      this.store.dispatch(MembersActions.deleteFamily());
    }
  }

  emailAdmin() {
    const bodyData = this.emailform.value;
    this.store.dispatch(MembersActions.emailAdmin({ bodyData }));
    this.closebox2();
  }

  makeAdmin(id: string) {
    this.store.dispatch(MembersActions.makeAdmin({ id }));
  }

  makeEarner(id: string) {
    this.store.dispatch(MembersActions.makeEarner({ id }));
  }
  openbox() {
    document.getElementById('contactForm2').style.display = 'block';
    document.getElementById('contactForm2').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';
  }
  closebox() {
    document.getElementById('contactForm2').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }
  openbox2() {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';
  }
  closebox2() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }
}
