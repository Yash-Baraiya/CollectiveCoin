import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';
import { TransactionService } from './transaction.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    public transactionservice: TransactionService
  ) {}

  ngOnInit(): void {
    this.transactionservice.gettAllTransactions();
  }
}
