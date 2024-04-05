import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IncomeService } from '../income/income.service';
import { ExpenseService } from '../expense/expense.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  incomeamounts = [];
  expenseamounts = [];

  constructor(
    private incomeservice: IncomeService,
    private expenseservice: ExpenseService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.incomeservice.getIncome();
    this.expenseservice.getExpense();

    this.createChart();
  }

  async createChart() {
    // Generate labels for the chart
    const labels = this.getDaysInMonth(
      new Date().getMonth() + 1,
      new Date().getFullYear()
    ).map((date) => date.toLocaleDateString('en-US'));

    // labels.forEach((label) => {
    //   if (label === this.incomeservice.incamounts.date) {
    //     this.incomeamounts.push(this.incomeservice.incamounts.amount);
    //   } else {
    //     this.incomeamounts.push(0);
    //   }
    // });
    //console.log(this.incomeamounts);
    var canvas = document.getElementById('myChart') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Incomes',
            data: this.incomeservice.amountsvalue,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Expenses',
            data: this.expenseservice.amountsvalue,
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  getDaysInMonth(month: number, year: number): Date[] {
    const date = new Date(year, month - 1, 1);
    const days = [];
    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
}
