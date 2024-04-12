import { Component, OnInit } from '@angular/core';
import { ExpenseService } from './expense.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {
  expensedatapop: any;

  constructor(
    public expenseservice: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.expenseservice.getExpense().subscribe(() => {
      console.log('getting expense');
    });
  }
  openbox4(id: any) {
    this.router.navigate([`update-expense/${id}`], { relativeTo: this.route });
  }
  closebox4() {}

  saveadd() {
    if (this.expenseservice.expenseForm.valid) {
      this.expenseservice.addExpense();
    } else {
      alert('please fill the form as directed');
    }
  }
}
