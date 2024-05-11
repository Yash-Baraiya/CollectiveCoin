import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpenseService } from '../../shared/services/expense.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit, OnDestroy {
  showCheckbox: boolean = false;
  currentPage: number;
  totalItems: number;
  showrecurrence: boolean = false;
  itemsPerPage: number = 4;

  constructor(
    public expenseservice: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.expenseservice.getExpense().subscribe(() => {
      this.currentPage = 1;
      this.totalItems = this.expenseservice.data.length;
    });
  }

  nextPage() {
    this.currentPage = this.currentPage + 1;
    this.expenseservice.getExpense(this.currentPage, this.itemsPerPage);
  }
  previousPage() {
    this.currentPage = this.currentPage - 1;
    this.expenseservice.getExpense(this.currentPage, this.itemsPerPage);
  }
  updateExpense(id: string) {
    this.router.navigate([`Expense/update-expense/${id}`]);
  }
  onCategoryChange(event: any) {
    const selectedCategory = event.target.value.trim();
    console.log('Selected Category:', selectedCategory);
    console.log('Is Monthly Bills?', selectedCategory === 'monthlybills');
    this.showCheckbox = selectedCategory === 'monthlybills';

    this.showrecurrence = selectedCategory === 'subscriptions';
  }

  saveadd() {
    if (this.expenseservice.expenseForm.valid) {
      this.expenseservice.addExpense();
    } else {
      alert('please fill the form as directed');
    }
  }

  ngOnDestroy(): void {
    this.expenseservice.totalexpense = 0;
    this.expenseservice.yearlyTotalExpense = 0;
  }
}
