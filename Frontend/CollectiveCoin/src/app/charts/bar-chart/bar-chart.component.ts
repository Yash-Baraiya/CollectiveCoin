import { Component, Output } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BudgetService } from '../../shared/services/budget.service';
import { Observable, map } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { BudgetState } from '../../budgetModule/budgetStore/budget.reducer';
import * as BudgetActions from './../../budgetModule/budgetStore/budget.actions';
import {
  selectExpCategoryAmounts,
  selectMonthlyBudget,
} from '../../budgetModule/budgetStore/budget.selector';
import { budget } from '../../shared/interfaces/budget.interface';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent {
  budgetData = [];
  expenseData = [];
  budgetData$: Observable<budget[]>;
  expenseData$: Observable<object>;

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

    this.budgetData$.subscribe(() => {
      this.expenseData$.subscribe(() => {
        this.fetchData().subscribe(() => {
          this.createChart();
        });
      });
    });
  }

  //fetching the data to show in chart
  fetchData(): Observable<void> {
    return new Observable((observer) => {
      // Fetch budget data
      this.budgetData$.subscribe((monthlyBudget) => {
        this.labels.forEach((label) => {
          const budgetItem = monthlyBudget.find(
            (item) => item.category === label
          );
          this.budgetData.push(budgetItem ? budgetItem.amount : 0);
        });
      });

      // Fetch expense data
      this.expenseData$.subscribe((expCategoryAmounts) => {
        this.labels.forEach((label) => {
          this.expenseData.push(
            expCategoryAmounts[label] ? expCategoryAmounts[label] : 0
          );
        });

        observer.next();
        observer.complete();
      });
    });
  }

  //method for creating the chart
  async createChart() {
    var canvas = document.getElementById('myChart2') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');

    var myChart = new Chart(ctx, {
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
      },
    });
  }
}
