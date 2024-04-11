import { Component, OnInit } from '@angular/core';

import { IncomeService } from './income.service';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent implements OnInit {
  incomedatapop: any;
  constructor(public incomeservice: IncomeService) {}

  ngOnInit(): void {
    this.incomeservice.getIncome();
  }

  openbox3(id: any) {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';

    this.incomeservice.data.forEach((income) => {
      if (income.id === id) {
        this.incomedatapop = income;
      }
    });
    console.log(this.incomedatapop);
    document.getElementById('poptitle').innerText = this.incomedatapop.title;
    document.getElementById('popamount').innerText = this.incomedatapop.amount;
    document.getElementById('popdate').innerText = this.incomedatapop.date;
    document.getElementById('popcategory').innerText =
      this.incomedatapop.category;
    document.getElementById('popaddedBy').innerText =
      this.incomedatapop.addedBy;
    document.getElementById('popdescription').innerText =
      this.incomedatapop.description;
  }
  closebox3() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    this.incomedatapop = {};
    console.log(this.incomedatapop);
    document.getElementById('poptitle').innerText = '';
    document.getElementById('popamount').innerText = '';
    document.getElementById('popcategory').innerText = '';
    document.getElementById('popdate').innerText = '';
    document.getElementById('popaddedBy').innerText = '';
    document.getElementById('popdescription').innerText = '';
  }

  save() {
    if (this.incomeservice.incomeForm.valid) {
      this.incomeservice.addIncome();
    } else {
      alert('please fill the form as directed');
    }
  }
}
