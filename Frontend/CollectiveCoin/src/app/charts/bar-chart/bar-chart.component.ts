import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { BudgetState } from '../../store/reducer/budget.reducer';
import * as BudgetActions from '../../store/actions/budget.actions';
import {
  selectExpCategoryAmounts,
  selectMonthlyBudget,
} from '../../store/selectors/budget.selector';
import { budget } from '../../shared/interfaces/budget.interface';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit, OnDestroy {
  budgetData: number[] = [];
  expenseData: number[] = [];
  budgetData$: Observable<budget[]>;
  expenseData$: Observable<object>;
  private subscription: Subscription;
  chart: Chart;

  labels = [
    'groceries',
    'subscriptions',
    'other',
    'education',
    'health',
    'shopping',
    'clothing',
    'travelling',
    'monthlybills',
  ];

  constructor(private store: Store<BudgetState>) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.store.dispatch(BudgetActions.loadBudgets());
    this.budgetData$ = this.store.select(selectMonthlyBudget);
    this.expenseData$ = this.store.select(selectExpCategoryAmounts);

    //to fethch the latest value for budgetdata and expense data
    this.subscription = combineLatest([this.budgetData$, this.expenseData$])
      .pipe(
        map(([budgetData, expenseData]) => {
          this.budgetData = this.labels.map((label) => {
            const budget = budgetData.find(
              (budget) => budget.category === label
            );
            return budget ? budget.amount : null;
          });

          this.expenseData = this.labels.map((label) => {
            const expense = expenseData[label] || 0;
            return expense;
          });

          // Call chart creation here
          this.createChart();
        })
      )
      .subscribe();
  }

  // method for creating the chart
  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    var canvas = document.getElementById('myChart2') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Budgets',
            data: this.budgetData,
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgb(255, 205, 86)',
          },
          {
            label: 'Expenses',
            data: this.expenseData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(255, 99, 132)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
