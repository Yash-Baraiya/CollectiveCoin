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
    console.log('button clicked');
    this.http
      .get<any>(
        'http://localhost:8000/api/v1/CollectiveCoin/user/transactions/all-transactions/downloadpdf'
      )
      .subscribe((resultData: any) => {
        try {
          const doc = new jsPDF();

          let yOffset = 10;
          this.transactionservice.alltransactions.forEach(
            (transaction: any) => {
              if (transaction.type === 'income') {
                doc.text(
                  `Income: ${transaction.title}, Amount: ${transaction.amount}, Date: ${transaction.date}`,
                  10,
                  yOffset
                );
              } else {
                doc.text(
                  `Expense: ${transaction.title}, Amount: ${transaction.amount}, Date: ${transaction.date}`,
                  10,
                  yOffset
                );
              }
              yOffset += 10;
            }
          );

          doc.save('transactions.pdf');
        } catch (error) {
          console.error(error);
        }
      });
  }

  clearFilters() {
    console.log('button is clicked');
    this.transactionservice.filtersForm.reset();
  }
}
