import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IncomeService } from '../income/income.service';
import { ExpenseService } from '../expense/expense.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  constructor(
    private incomeservice: IncomeService,
    private expenseservice: ExpenseService
  ) {
    Chart.register(...registerables);
  }
  async ngOnInit() {
    await this.incomeservice.getIncome();
    await this.expenseservice.getExpense();

    await this.createChart();
  }

  createChart() {
    const incomeData = this.incomeservice.amounts.map((obj) => ({
      date: obj.date,
    }));
    const expenseData = this.expenseservice.amounts.map((obj) => ({
      date: obj.date,
    }));
    var canvas = document.getElementById('myChart') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.getDaysInMonth(2, 2024).map((date) =>
          date.toLocaleDateString('en-US')
        ),
        datasets: [
          {
            label: 'incomes',
            data: this.incomeservice.amountsvalue,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'expenses',
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

  getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
  // createChart() {
  //   // Assuming your data objects have a 'date' property
  //   const incomeData = this.incomeservice.amounts.map(obj => ({ date: obj.date, amount: obj.amount }));
  //   const expenseData = this.expenseservice.amounts.map(obj => ({ date: obj.date, amount: obj.amount }));

  //   const labels = this.lableDates.map(date => date.toLocaleDateString('en-US'));

  //   const incomeValues = [];
  //   const expenseValues = [];

  //   // Match dates with labels and extract corresponding amounts
  //   labels.forEach(label => {
  //     const incomeEntry = incomeData.find(data => data.date.toLocaleDateString('en-US') === label);
  //     const expenseEntry = expenseData.find(data => data.date.toLocaleDateString('en-US') === label);

  //     incomeValues.push(incomeEntry ? incomeEntry.amount : 0);
  //     expenseValues.push(expenseEntry ? expenseEntry.amount : 0);
  //   });

  //   var canvas = document.getElementById('myChart') as HTMLCanvasElement;
  //   var ctx = canvas.getContext('2d');
  //   var myChart = new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: 'incomes',
  //           data: incomeValues,
  //           fill: false,
  //           borderColor: 'rgb(75, 192, 192)',
  //           tension: 0.1,
  //         },
  //         {
  //           label: 'expenses',
  //           data: expenseValues,
  //           fill: false,
  //           borderColor: 'rgb(255, 99, 132)',
  //           tension: 0.1,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //     },
  //   });
  // }
}
