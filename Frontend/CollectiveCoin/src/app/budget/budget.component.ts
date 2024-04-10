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
  constructor(public budgetservice: BudgetService) {}

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
