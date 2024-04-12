import { Component, OnInit } from '@angular/core';
import { BudgetService } from './budget.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
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
  constructor(
    public budgetservice: BudgetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  openbox4(id: any) {
    this.router.navigate([`update-budget/${id}`], { relativeTo: this.route });
  }
  closebox4() {}

  ngOnInit(): void {
    this.budgetservice.getBudgets().subscribe(() => {
      console.log('getting budgets');
    });
  }

  save() {
    if (this.budgetservice.budgetForm.valid) {
      this.budgetservice.addBudget();
    } else {
      alert('please fill the form as directed');
    }
  }
}
