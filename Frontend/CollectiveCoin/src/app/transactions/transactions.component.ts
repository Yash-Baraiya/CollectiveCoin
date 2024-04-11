import { Component, OnInit } from '@angular/core';
import { TransactionService } from './transaction.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  transactiondatapop: any;
  constructor(public transactionservice: TransactionService) {}
  openbox5(id: any) {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';

    this.transactionservice.alltransactions.forEach((transaction) => {
      if (transaction.id === id) {
        this.transactiondatapop = transaction;
      }
    });
    console.log(this.transactiondatapop);
    document.getElementById('poptitle').innerText =
      this.transactiondatapop.title;
    document.getElementById('popamount').innerText =
      this.transactiondatapop.amount;
    document.getElementById('popdate').innerText = this.transactiondatapop.date;
    document.getElementById('popcategory').innerText =
      this.transactiondatapop.category;
    document.getElementById('popaddedBy').innerText =
      this.transactiondatapop.addedBy;
    document.getElementById('popdescription').innerText =
      this.transactiondatapop.description;
  }
  closebox5() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    this.transactiondatapop = {};
    console.log(this.transactiondatapop);
    document.getElementById('poptitle').innerText = '';
    document.getElementById('popamount').innerText = '';
    document.getElementById('popcategory').innerText = '';
    document.getElementById('popdate').innerText = '';
    document.getElementById('popaddedBy').innerText = '';
    document.getElementById('popdescription').innerText = '';
  }

  ngOnInit(): void {
    this.transactionservice.gettAllTransactions();
  }
}
