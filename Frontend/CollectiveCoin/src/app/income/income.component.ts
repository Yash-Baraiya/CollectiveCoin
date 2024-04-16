import { Component, OnInit } from '@angular/core';

import { IncomeService } from './income.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent implements OnInit {
  incomedatapop: any;
  role: string
  constructor(
    public incomeservice: IncomeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    
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
