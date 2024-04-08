import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Router } from '@angular/router';

import { IncomeService } from './income.service';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent implements OnInit {
  photo = "";
  constructor(
    private http: HttpClient,
    public incomeservice: IncomeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.incomeservice.getIncome();
  }

  openbox3() {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('contactForm').style.display = 'overlay';
    const inc = this.incomeservice.data;
  }
  closebox3() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }

  save() {
    if (this.incomeservice.incomeForm.valid) {
      this.incomeservice.addIncome();
    } else {
      alert('please fill the form as directed');
    }
  }
}
