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

  async createChart() {
    // Generate labels for the chart
    const labels = this.getDaysInMonth(2, 2024).map((date) =>
      date.toLocaleDateString('en-US')
    );
    console.log(labels);

    // Get the data for incomes and expenses
    const incomeValues = this.getIncomesForMonth(2, 2024);
    console.log('income values', incomeValues);
    const expenseValues = this.getExpensesForMonth(2, 2024);
    console.log('expense values :', expenseValues);

    // Create chart
    var canvas = document.getElementById('myChart') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Incomes',
            data: incomeValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Expenses',
            data: expenseValues,
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

  getIncomesForMonth(month: number, year: number): number[] {
    const incomes = this.incomeservice.amounts;
    const daysInMonth = this.getDaysInMonth(month, year);
    return daysInMonth.map((day) => {
      const incomeEntry = incomes.find((entry) =>
        this.isSameDay(entry.date, day)
      );
      return incomeEntry ? incomeEntry.amount : 0;
    });
  }

  getExpensesForMonth(month: number, year: number): number[] {
    const expenses = this.expenseservice.amounts;
    const daysInMonth = this.getDaysInMonth(month, year);
    return daysInMonth.map((day) => {
      const expenseEntry = expenses.find((entry) =>
        this.isSameDay(entry.date, day)
      );
      return expenseEntry ? expenseEntry.amount : 0;
    });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
