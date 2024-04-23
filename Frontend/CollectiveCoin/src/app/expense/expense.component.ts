import { Component, OnInit } from '@angular/core';
import { ExpenseService } from './expense.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Stripe from 'stripe';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {
  expensedatapop: any;
  showAdditionalFields: boolean = false;
  stripePromise: Promise<Stripe>;

  constructor(
    public expenseservice: ExpenseService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    //this.stripePromise = this.loadStripe();
  }

  private loadStripe(): Promise<Stripe> {
    return (window as any).Stripe(
      'pk_test_51P7XldSCqlnBTgeBDXQpbvdF3fgScPKDMNyjmtwTu2BWasJkUtuJvtEodSTEE9akM6eaW4mADMNjzuV78nwPLOxX00e8uBseJH'
    );
  }
  ngOnInit(): void {
    this.expenseservice.getExpense().subscribe(() => {
      console.log('getting expense');
    });
  }
  payment(id: any) {
    console.log('button clicked');

    this.http
      .post(
        `http://localhost:8000/api/v1/CollectiveCoin/user/expenses/billpayment/${id}`,
        {}
      )
      .subscribe(
        (resultData: any) => {
          try {
            console.log(resultData);
            this.router.navigate(resultData.link);
          } catch (error) {
            console.log(error);
          }
        },
        (error) => {
          console.log(error);
          if (error.error.message) {
            alert(error.error.message);
          } else {
            alert('There was a problem loading this page. Please login again.');
            //this.router.navigate(['/login']);
          }
          if (error.error.message === 'Please login first') {
            this.router.navigate(['/login']);
          }
        }
      );
  }
  openbox4(id: any) {
    this.router.navigate([`update-expense/${id}`], { relativeTo: this.route });
  }
  onCategoryChange(event: any) {
    const selectedCategory = event.target.value.trim();
    console.log('Selected Category:', selectedCategory);
    console.log('Is Monthly Bills?', selectedCategory === 'monthlybills');
    this.showAdditionalFields = selectedCategory === 'monthlybills';
  }

  saveadd() {
    if (this.expenseservice.expenseForm.valid) {
      this.expenseservice.addExpense();
    } else {
      alert('please fill the form as directed');
    }
  }
}
