import { Component, OnInit, OnDestroy } from '@angular/core';

import { IncomeService } from './income.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDataService } from '../shared/login-data.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent implements OnInit, OnDestroy {
  incomedatapop: any;
  isEarning: any;
  data: any;
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(
    public incomeservice: IncomeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isEarning = localStorage.getItem('isEarning');
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        style: 'background-color : blue ',
      }
    );
  }
  ngOnInit(): void {
    this.incomeservice.getIncome().subscribe(() => {
      console.log(' subscriberd method is getting called');
    });
  }
  ngOnDestroy() {
    this.incomeservice.incomeForm.reset();
  }

  openbox3(id: any) {
    this.router.navigate([`update-income/${id}`], { relativeTo: this.route });
  }
  closebox3() {}

  save() {
    if (this.incomeservice.incomeForm.valid) {
      this.incomeservice.addIncome();
    } else {
      alert('please fill the form as directed');
    }
  }
}
