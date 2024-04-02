import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginDataService } from '../shared/login-data.service';
import IncomeResponse from './income.interface';
import { Router } from '@angular/router';
import { totalIncomeService } from '../shared/totalincome.service';
import { ElementRef } from '@angular/core';
import { IncomeService } from './income.service';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent implements OnInit {
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
