import { Component, OnInit, OnDestroy } from '@angular/core';
import { IncomeService } from '../../shared/services/income.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDataService } from '../../shared/services/login-data.service';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent implements OnInit, OnDestroy {
  isEarning: boolean;
  currentPage: number;
  totalItems: number;

  constructor(
    public incomeservice: IncomeService,
    private router: Router,
    private route: ActivatedRoute,
    private logindataservice: LoginDataService
  ) {
    this.logindataservice.isLoggedin().subscribe(() => {
      this.isEarning = this.logindataservice.isEarning;
    });
  }
  ngOnInit(): void {
    this.incomeservice.getIncome().subscribe(() => {
      this.currentPage = 1;
      this.totalItems = this.incomeservice.data.length;
    });
  }

  updateIncome(id: string) {
    this.router.navigate([`Income/update-income/${id}`]);
  }

  save() {
    if (this.incomeservice.incomeForm.valid) {
      this.incomeservice.addIncome();
    } else {
      alert('please fill the form as directed');
    }
  }
  ngOnDestroy() {
    this.incomeservice.incomeForm.reset();
  }
}
