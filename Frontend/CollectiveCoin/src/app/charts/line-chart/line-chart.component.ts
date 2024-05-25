import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncomeState } from '../../store/reducer/income.reducer';
import { Store } from '@ngrx/store';
import { loadIncomes } from '../../store/actions/income.actions';
import { selectIncomeData } from '../../store/selectors/income.selector';
import { ExpenseState } from './../../store/reducer/expense.reducer';
import { loadExpense } from '../../store/actions/expense.actions';
import { selectExpAmounts } from '../../store/selectors/expense.selector';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnDestroy {
  incomeamounts: Array<number> = [];
  expenseamounts: Array<number> = [];
  incomedata$: Observable<any[]>;
  exepnsedata$: Observable<any[]>;
  private chart: Chart;
  private subscription: Subscription;
  labels = this.getDaysInMonth(
    new Date().getMonth() + 1,
    new Date().getFullYear()
  ).map((date) => date);

  constructor(
    private incomestore: Store<IncomeState>,
    private expensestore: Store<ExpenseState>
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.incomedata$ = this.incomestore.select(selectIncomeData);
    this.exepnsedata$ = this.expensestore.select(selectExpAmounts);

    this.incomestore.dispatch(loadIncomes());
    this.expensestore.dispatch(loadExpense({}));

    this.subscription = combineLatest([this.incomedata$, this.exepnsedata$])
      .pipe(
        map(([incomeData, expenseData]) => {
          this.incomeamounts = this.labels.map((label) => {
            const income = incomeData.find(
              (income) => this.formatDateString(income.date) === label
            );
            return income ? income.amount : null;
          });

          this.expenseamounts = this.labels.map((label) => {
            const expense = expenseData.find(
              (expense) => this.formatDateString(expense.date) === label
            );
            return expense ? expense.amount : null;
          });
        })
      )
      .subscribe(() => {
        this.createChart();
      });
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
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
            min: 0,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  formatDateString(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
