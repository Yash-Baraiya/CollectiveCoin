import { Component, OnInit } from '@angular/core';

import * as jspdf from 'jspdf';
import { HttpClient } from '@angular/common/http';
import 'jspdf-autotable';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../shared/services/transaction.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  currentPage: number;
  totalItems: number;

  showFilters: boolean = false;
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  constructor(
    public transactionservice: TransactionService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  openbox5(id: any) {}
  closebox5() {}

  ngOnInit(): void {
    this.transactionservice.gettAllTransactions().subscribe(() => {
      this.currentPage = 1;
      this.totalItems = this.transactionservice.alltransactions.length;
    });
  }
  downloadTransactionsPDF(): void {
    try {
      const pdf = new jspdf.jsPDF();

      const columns = ['Title', 'Type', 'Amount', 'Date', 'Added By'];

      const rows = this.transactionservice.alltransactions.map(
        (transaction: any) => [
          transaction.title,
          transaction.type,
          transaction.amount,
          transaction.date,
          transaction.addedBy,
        ]
      );

      pdf.text('CollectiveCoin', 20, 20);

      (pdf as any).autoTable({
        startY: 30,
        head: [columns],
        body: rows,
      });

      pdf.save('transactions.pdf');
    } catch (error) {
      console.error('Error downloading transactions PDF:', error);
    }
  }

  updateTransaction(id: any, type: any) {
    console.log('transaction', id, type);
    if (type === 'expense') {
      this.router.navigate([`Expense/update-expense/${id}`]);
    } else {
      this.router.navigate([`Income/update-income/${id}`]);
    }
  }

  clearFilters() {
    console.log('button is clicked');

    this.transactionservice.filtersForm.reset();
    this.transactionservice.gettAllTransactions();
  }
}
