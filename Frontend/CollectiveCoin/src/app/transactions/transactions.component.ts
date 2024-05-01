import { Component, OnInit } from '@angular/core';
import { TransactionService } from './transaction.service';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  transactiondatapop: any;
  showFilters: boolean = false;
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  constructor(
    public transactionservice: TransactionService,
    private http: HttpClient
  ) {}
  openbox5(id: any) {}
  closebox5() {}

  ngOnInit(): void {
    this.transactionservice.gettAllTransactions();
  }
  downloadTransactionsPDF(): void {
    // Make a GET request to the backend endpoint
    this.http
      .get(
        'http://localhost:8000/api/v1/CollectiveCoin/user/transactions/all-transactions/downloadpdf',
        {
          responseType: 'blob', // Set the response type to blob
        }
      )
      .subscribe(
        (blob: Blob) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);

          // Create a link element
          const link = document.createElement('a');
          link.href = url;
          link.download = 'transactions.pdf';

          // Append the link to the body
          document.body.appendChild(link);

          // Click the link to trigger the download
          link.click();

          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        },
        (error) => {
          console.error('Error downloading PDF:', error);
        }
      );
  }

  clearFilters() {
    console.log('button is clicked');

    this.transactionservice.filtersForm.reset();
    this.transactionservice.gettAllTransactions();
  }
}
