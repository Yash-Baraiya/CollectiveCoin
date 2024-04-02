import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncomeService } from '../income/income.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
})
export class BudgetComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public incomeservice: IncomeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.incomeservice.getIncome();
  }

  save() {
    if (this.incomeservice.incomeForm.valid) {
      this.incomeservice.addIncome();
    } else {
      alert('please fill the form as directed');
    }
  }
}
