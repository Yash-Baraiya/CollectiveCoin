import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BudgetService } from './budget.service';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDataService } from '../shared/login-data.service';
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  animations: [
    trigger('scroll', [
      transition('* => *', [
        animate(
          '10s',
          keyframes([
            style({ transform: 'translateX(100%)', offset: 0 }),
            style({ transform: 'translateX(-100%)', offset: 0.3 }),
            style({ transform: 'translateX(-200%)', offset: 0.6 }),
            style({ transform: 'translateX(-300%)', offset: 0.9 }),
          ])
        ),
      ]),
    ]),
    trigger('scrollAnimation', [
      state(
        'start',
        style({
          transform: 'translateX(125%)',
        })
      ),
      state(
        'end',
        style({
          transform: 'translateX(-125%)',
        })
      ),
      transition('start => end', animate('5s')),
      transition('end => start', animate('0s')),
    ]),
  ],
})
export class BudgetComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  budgetdatapop: any;
  isEarning: any;
  animationState = 'start';
  data: any;
  constructor(
    public budgetservice: BudgetService,
    private router: Router,
    private route: ActivatedRoute,
    private loginservice: LoginDataService
  ) {}
  openbox4(id: any) {
    this.router.navigate([`update-budget/${id}`], { relativeTo: this.route });
  }
  scrollTicker() {
    console.log('animation called again');
    setInterval(() => {
      console.log('animation reseted');
      this.animationState = this.animationState === 'start' ? 'end' : 'start';
    }, 5000);
  }

  ngOnInit(): void {
    this.data = this.loginservice.getData();
    this.isEarning = this.data.data.user.isEarning;
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
