import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ExpenseService } from '../expense/expense.service';
import { BudgetService } from '../budget/budget.service';

@Component({
  selector: 'app-bar-cart',
  templateUrl: './bar-cart.component.html',
  styleUrl: './bar-cart.component.css',
})
export class BarCartComponent {
  budgetdata = [];
  expensedata = [];
  labels = [
    'groceries',
    'subscriptions',
    'other',
    'education',
    'health',
    'takeaways',
    'clothing',
    'travelling',
  ];
  constructor(
    private budgetservice: BudgetService,
    private expenseservice: ExpenseService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.budgetservice.getBudgets();
    this.expenseservice.getExpense();
    this.fetchBudgetData();
    this.fetchExpenseData();
    console.log('coming from bar-chart ', this.expensedata);
    console.log('coming from bar-chart', this.budgetdata);
    this.createChart();
  }
  fetchBudgetData() {
    this.labels.forEach((label) => {
      let value: boolean;
      for (let i = 0; i < this.budgetservice.amounts.length; i++) {
        if (this.budgetservice.amounts[i].category === label) {
          this.budgetdata.push(this.budgetservice.amounts[i].amount);
          value = true;
          break;
        }
      }
      if (!value) {
        this.budgetdata.push(0);
      }
    });
  }
  fetchExpenseData() {
    this.labels.forEach((label) => {
      let value: boolean;

      for (let amount in this.budgetservice.expcategoryAmounts) {
        if (amount === label) {
          this.expensedata.push(this.budgetservice.expcategoryAmounts[amount]);
          value = true;
          break;
        }
      }
      if (!value) {
        this.expensedata.push(0);
      }
    });
  }

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
            data: this.budgetdata,
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgb(255, 205, 86)',
          },
          {
            label: 'Expenses',
            data: this.expensedata,
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
