import { Component, OnDestroy, OnInit } from '@angular/core';
import { BudgetService } from '../../shared/services/budget.service';
import { Router } from '@angular/router';
import { LoginDataService } from '../../shared/services/login-data.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetComponent implements OnInit, OnDestroy {
  isEarning: boolean;
  currentPage: number;
  totalItems: number;

  constructor(
    public budgetservice: BudgetService,
    private router: Router,
    private logindataservice: LoginDataService
  ) {}
  updateBudget(id: string) {
    this.router.navigate([`Budget/update-budget/${id}`]);
  }
  ngOnInit(): void {
    this.logindataservice.isLoggedin().subscribe(() => {
      this.isEarning = this.logindataservice.isEarning;
    });
    this.budgetservice.getBudgets().subscribe(() => {
      this.currentPage = 1;
      this.totalItems = this.budgetservice.data.length;
    });
  }

  save() {
    if (this.budgetservice.budgetForm.valid) {
      this.budgetservice.addBudget();
    } else {
      alert('please fill the form as directed');
    }
  }
  ngOnDestroy(): void {
    this.budgetservice.budgetForm.reset();
  }
}
