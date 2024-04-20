import { Component, OnInit } from '@angular/core';

import { IncomeService } from './income.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDataService } from '../shared/login-data.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent implements OnInit {
  incomedatapop: any;
  isEarning: any;
  data: any;
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(
    public incomeservice: IncomeService,
    private router: Router,
    private route: ActivatedRoute,
    private loginservice: LoginDataService
  ) {
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        style: 'background-color : blue ',
      }
    );
  }

  ngOnInit(): void {
    this.data = this.loginservice.getData();
    this.isEarning = this.data.data.user.isEarning;

    this.incomeservice.getIncome().subscribe(() => {
      console.log(' subscriberd method is getting called');
    });
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
