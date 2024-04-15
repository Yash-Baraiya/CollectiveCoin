import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IncomeService } from '../income/income.service';
import { ExpenseService } from '../expense/expense.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  incomeamounts: Array<number> = [];
  expenseamounts: Array<number> = [];

  labels = this.getDaysInMonth(
    new Date().getMonth() + 1,
    new Date().getFullYear()
  ).map((date) => date);

  constructor(
    private incomeservice: IncomeService,
    private expenseservice: ExpenseService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.incomeservice.getIncome().subscribe(() => {
      this.expenseservice.getExpense().subscribe(() => {
        this.fetchData().subscribe(() => {
          this.createChart();
        });
      });
    });
  }
  fetchData(): Observable<any> {
    return new Observable((obseraver) => {
      this.labels.forEach((label) => {
        let value: boolean;
        for (let i = 0; i < this.incomeservice.incamounts.length; i++) {
          if (this.incomeservice.incamounts[i].date === label) {
            this.incomeamounts.push(this.incomeservice.incamounts[i].amount);
            value = true;
            break;
          }
        }
        if (!value) {
          this.incomeamounts.push(null);
        }
      });
      this.labels.forEach((label) => {
        let value: boolean;
        for (let i = 0; i < this.expenseservice.expamounts.length; i++) {
          if (this.expenseservice.expamounts[i].date === label) {
            this.expenseamounts.push(this.expenseservice.expamounts[i].amount);
            value = true;
            break;
          }
        }
        if (!value) {
          this.expenseamounts.push(null);
        }
      });

      obseraver.next();
      obseraver.complete();
    });
  }

  async createChart() {
    var canvas = document.getElementById('myChart') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Incomes',
            data: this.incomeamounts,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Expenses',
            data: this.expenseamounts,
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
        ],
      },
      options: {
        spanGaps: true,
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            beginAtZero: true,
          },
        },
        responsive: true,
      },
    });
  }

  getDaysInMonth(month: number, year: number): string[] {
    const date = new Date(year, month - 1, 1);
    const days: string[] = [];

    while (date.getMonth() === month - 1) {
      const day = date.getDate();
      const formattedDay = day < 10 ? '0' + day : day;
      const formattedMonth = month < 10 ? '0' + month : month;
      const formattedYear = date.getFullYear();

      const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
      days.push(formattedDate);
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
}
