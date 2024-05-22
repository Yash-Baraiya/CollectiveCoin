import { Component, Output } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BudgetService } from '../../shared/services/budget.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent {
  budgetdata = [];
  expensedata = [];

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
  constructor(private budgetservice: BudgetService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.budgetservice.getBudgets().subscribe(() => {
      this.fetchData().subscribe(() => {
        this.createChart();
      });
    });
  }

  //fetching the data to show in chart
  fetchData(): Observable<any> {
    return new Observable((obseraver) => {
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

      this.labels.forEach((label) => {
        let value: boolean;

        for (let amount in this.budgetservice.expcategoryAmounts) {
          if (amount === label) {
            this.expensedata.push(
              this.budgetservice.expcategoryAmounts[amount]
            );
            value = true;
            break;
          }
        }
        if (!value) {
          this.expensedata.push(0);
        }
      });

      obseraver.next();
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
