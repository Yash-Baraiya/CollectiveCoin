import { Component, OnInit } from '@angular/core';
import { ExpenseService } from './expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {
  title: string = '';
  amount: any;
  category: string = '';
  date: any;
  description: string;

  constructor(public expenseservice: ExpenseService) {}

  ngOnInit(): void {
    this.expenseservice.getExpense();
  }
  openbox4() {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';
    //const inc = this.expenseservice.data;
  }
  closebox4() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }

  saveadd() {
    if (this.expenseservice.expenseForm.valid) {
      this.expenseservice.addExpense();
    } else {
      alert('please fill the form as directed');
    }
  }
}
