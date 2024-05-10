import { Component, OnDestroy, OnInit } from '@angular/core';
import { BudgetService } from '../../shared/services/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private logindataservice: LoginDataService
  ) {}
  updateBudget(id: string) {
    console.log(this.budgetservice.data);
    console.log(id);
    this.router.navigate([`update-budget/${id}`], { relativeTo: this.route });
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
