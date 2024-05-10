import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import { TransactionService } from '../shared/services/transaction.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  currentPage: number = 1;

  totalItems: number;
  showFilters: boolean = false;
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  constructor(
    public transactionservice: TransactionService,
    private router: Router
  ) {}

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
        startY: 40,
        head: [columns],
        body: rows,
      });
      pdf.text('Transactions Details :', 20, 35);

      pdf.text(
        `total Transactions :${this.transactionservice.alltransactions.length}`,
        20,
        120
      );

      pdf.save('transactions.pdf');
    } catch (error) {
      console.error('Error downloading transactions PDF:', error);
    }
  }

  updateTransaction(id: string, type: string) {
    console.log('transaction', id, type);
    if (type === 'expense') {
      this.router.navigate([`Expense/update-expense/${id}`]);
    } else {
      this.router.navigate([`Income/update-income/${id}`]);
    }
  }
  // previousPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.transactionservice.gettAllTransactions();
  //   }
  // }

  // nextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //     this.transactionservice.gettAllTransactions();
  //   }
  // }

  // changePage(page: number) {
  //   if (page >= 1 && page <= this.totalPages) {
  //     this.currentPage = page;
  //     this.transactionservice.gettAllTransactions();
  //   }
  // }

  clearFilters() {
    console.log('button is clicked');

    this.transactionservice.filtersForm.reset();
    this.transactionservice.gettAllTransactions();
  }
}
