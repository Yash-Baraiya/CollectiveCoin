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
  constructor(
    private http: HttpClient,
    public expenseservice: ExpenseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.expenseservice.getExpense();
  }

  saveadd() {
    if (this.expenseservice.expenseForm.valid) {
      this.expenseservice.addExpense();
    } else {
      alert('please fill the form as directed');
    }
  }
}
