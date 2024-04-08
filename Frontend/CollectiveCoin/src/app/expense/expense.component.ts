import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginDataService } from '../shared/login-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ExpenseResponse from './expense.interface';
import { ExpenseService } from './expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {
  title: string = '';
  amount: any;
  category: string = '';
  date: any;
  description: string;

  constructor(
    private http: HttpClient,
    public expenseservice: ExpenseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.expenseservice.getExpense();
  }
  openbox4() {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('contactForm').style.display = 'overlay';
    //const inc = this.expenseservice.data;
  }
  closebox4() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }

  saveadd() {
    if (this.expenseservice.expenseForm.valid) {
      this.expenseservice.addExpense();
    } else {
      alert('please fill the form as directed');
    }
  }
}
