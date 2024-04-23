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
  openbox5(id: any) {}
  closebox5() {}

  ngOnInit(): void {
    this.transactionservice.gettAllTransactions();
  }
}
