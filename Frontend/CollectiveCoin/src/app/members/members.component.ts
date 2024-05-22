import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './memberstore/members.reducer';
import * as MembersActions from './memberstore/members.action';
import { LoginDataService } from '../shared/services/login-data.service';
import { selectMembers } from './memberstore/members.selector';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit {
  allmembers$: Observable<any[]>;
  memberrform: FormGroup;
  emailform: FormGroup;
  role: string;
  priority: number;

  constructor(
    private store: Store<AppState>,
    private logindataservice: LoginDataService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any
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

    this.logindataservice.isLoggedin().subscribe(() => {
      this.role = this.logindataservice.role;
      this.priority = this.logindataservice.priority;
      this.store.dispatch(MembersActions.loadMembers());
      this.allmembers$ = this.store.select(selectMembers);
      console.log(this.allmembers$);
    });
  }

  addmember() {
    console.log('button clicked');
    const bodyData = this.memberrform.value;
    this.store.dispatch(MembersActions.addMember({ member: bodyData }));
    this.closebox('ContactForm');
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
    this.closebox2('contactForm');
  }

  makeAdmin(id: string) {
    this.store.dispatch(MembersActions.makeAdmin({ id }));
  }

  makeEarner(id: string) {
    this.store.dispatch(MembersActions.makeEarner({ id }));
  }
  openbox(id) {
    const contactForm = this.document.getElementById(id);
    const overlay = this.document.getElementById('overlay');

    if (contactForm && overlay) {
      this.renderer.setStyle(contactForm, 'display', 'block');
      this.renderer.setStyle(contactForm, 'opacity', '1');
      this.renderer.setStyle(overlay, 'display', 'block');
    }
  }
  closebox(id) {
    const contactForm = this.document.getElementById(id);
    const overlay = this.document.getElementById('overlay');

    if (contactForm && overlay) {
      this.renderer.setStyle(contactForm, 'display', 'none');
      this.renderer.setStyle(overlay, 'display', 'none');
    }
  }
  openbox2(id) {
    const contactForm = this.document.getElementById(id);
    const overlay = this.document.getElementById('overlay');
    if (contactForm && overlay) {
      this.renderer.setStyle(contactForm, 'display', 'block');
      this.renderer.setStyle(contactForm, 'opacity', '1');
      this.renderer.setStyle(overlay, 'display', 'block');
    }
  }
  closebox2(id) {
    const contactForm = this.document.getElementById(id);
    const overlay = this.document.getElementById('overlay');

    if (contactForm && overlay) {
      this.renderer.setStyle(contactForm, 'display', 'none');
      this.renderer.setStyle(overlay, 'display', 'none');
    }
  }
}
