import { Component, OnInit } from '@angular/core';
import { ExpenseService } from './expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {
  expensedatapop: any;

  constructor(public expenseservice: ExpenseService) {}

  ngOnInit(): void {
    this.expenseservice.getExpense();
  }
  openbox4(id: any) {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';

    this.expenseservice.data.forEach((expense) => {
      if (expense.id === id) {
        this.expensedatapop = expense;
      }
    });
    console.log(this.expensedatapop);
    document.getElementById('poptitle').innerText = this.expensedatapop.title;
    document.getElementById('popamount').innerText = this.expensedatapop.amount;
    document.getElementById('popdate').innerText = this.expensedatapop.date;
    document.getElementById('popcategory').innerText =
      this.expensedatapop.category;
    document.getElementById('popaddedBy').innerText =
      this.expensedatapop.addedBy;
    document.getElementById('popdescription').innerText =
      this.expensedatapop.description;
  }
  closebox4() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    this.expensedatapop = {};
    console.log(this.expensedatapop);
    document.getElementById('poptitle').innerText = '';
    document.getElementById('popamount').innerText = '';
    document.getElementById('popcategory').innerText = '';
    document.getElementById('popdate').innerText = '';
    document.getElementById('popaddedBy').innerText = '';
    document.getElementById('popdescription').innerText = '';
  }

  saveadd() {
    if (this.expenseservice.expenseForm.valid) {
      this.expenseservice.addExpense();
    } else {
      alert('please fill the form as directed');
    }
  }
}
