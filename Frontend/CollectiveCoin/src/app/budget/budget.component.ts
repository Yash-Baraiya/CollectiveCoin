import { Component, OnInit } from '@angular/core';
import { BudgetService } from './budget.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
  animations: [
    trigger('scroll', [
      state(
        'start',
        style({
          transform: 'translateX(0)',
        })
      ),
      state(
        'end',
        style({
          transform: 'translateX(-100%)',
        })
      ),
      transition('start => end', animate('10s')),
    ]),
  ],
})
export class BudgetComponent implements OnInit {
  budgetdatapop: any;
  constructor(public budgetservice: BudgetService) {}

  openbox4(id: any) {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';

    this.budgetservice.data.forEach((budget) => {
      if (budget.id === id) {
        this.budgetdatapop = budget;
      }
    });
    console.log(this.budgetdatapop);
    document.getElementById('poptitle').innerText = this.budgetdatapop.title;
    document.getElementById('popamount').innerText = this.budgetdatapop.amount;
    document.getElementById('popdate').innerText = this.budgetdatapop.date;
    document.getElementById('popcategory').innerText =
      this.budgetdatapop.category;
    document.getElementById('popaddedBy').innerText =
      this.budgetdatapop.createdBy;
    document.getElementById('popdescription').innerText =
      this.budgetdatapop.description;
  }
  closebox4() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    this.budgetdatapop = {};
    console.log(this.budgetdatapop);
    document.getElementById('poptitle').innerText = '';
    document.getElementById('popamount').innerText = '';
    document.getElementById('popcategory').innerText = '';
    document.getElementById('popdate').innerText = '';
    document.getElementById('popaddedBy').innerText = '';
    document.getElementById('popdescription').innerText = '';
  }

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
