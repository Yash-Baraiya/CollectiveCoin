import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncomeService } from '../income/income.service';
import { Router } from '@angular/router';
import { BudgetService } from './budget.service';
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
})
export class BudgetComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public budgetservice: BudgetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.budgetservice.getBudgets();
  }

  save() {
    if (this.budgetservice.budgetForm.valid) {
      this.budgetservice.addBudget();
    } else {
      alert('please fill the form as directed');
    }
  }
}
