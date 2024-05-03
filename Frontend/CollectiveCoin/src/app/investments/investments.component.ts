import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrl: './investments.component.css',
})
export class InvestmentsComponent implements OnInit {
  isEarning: any;
  data: any;
  investmentForm: FormGroup;
  constructor() {}

  ngOnInit(): void {
    this.isEarning = localStorage.getItem('isEarning');

    this.investmentForm = new FormGroup({
      category: new FormControl('', [Validators.required]),
    });
  }
}
