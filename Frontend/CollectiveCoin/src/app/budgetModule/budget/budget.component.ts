import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BudgetService } from '../../shared/services/budget.service';
import {
  animate,
  keyframes,
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
    trigger('scrollAnimation', [
      state(
        'start',
        style({
          transform: 'translateX(-100%)',
        })
      ),
      state(
        'end',
        style({
          transform: 'translateX(+100%)',
        })
      ),
      transition('start <=> end', animate('10s linear')),
    ]),
  ],
})
export class BudgetComponent implements OnInit, OnDestroy {
  isEarning: any;
  animationState = 'start';
  data: any;
  constructor(
    public budgetservice: BudgetService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isEarning = localStorage.getItem('isEarning');
  }
  updateBudget(id: any) {
    this.router.navigate([`update-budget/${id}`], { relativeTo: this.route });
  }
  scrollTicker() {
    console.log('animation called again');
    setTimeout(() => {
      console.log('animation reseted');
      this.animationState = this.animationState === 'start' ? 'end' : 'start';
    }, 5000);
  }

  ngOnInit(): void {
    this.budgetservice.getBudgets().subscribe(() => {
      console.log('getting budgets');
    });
  }

  ngOnDestroy(): void {
    this.budgetservice.budgetForm.reset();
  }
  save() {
    if (this.budgetservice.budgetForm.valid) {
      this.budgetservice.addBudget();
    } else {
      alert('please fill the form as directed');
    }
  }
}
