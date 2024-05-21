import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import {
  TransactionState,
  transactionReducer,
} from './trasactionStore/transactions.reducer';
import {
  deleteTransaction,
  filterTransactions,
  loadTransactions,
} from './trasactionStore/transactions.action';
import {
  selectAllTransactions,
  selectTotalTransactions,
} from './trasactionStore/transactions.selector';
import { map } from 'rxjs';
import { TransactionService } from '../shared/services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  currentPage$: number = 1;

  totalItems$: Observable<number>;
  allTransactions$: Observable<any[]>;
  showFilters: boolean = false;
  deleteMethod: Function;
  currentPage: any;

  constructor(
    private store: Store<TransactionState>,
    public transactionsservice: TransactionService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadTransactions());
    this.deleteMethod = deleteTransaction;

    this.allTransactions$ = this.store.select(selectAllTransactions);
    this.allTransactions$.subscribe(() => {
      console.log('trana', this.allTransactions$);
    });
    this.totalItems$ = this.store.pipe(select(selectTotalTransactions));
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  downloadTransactionsPDF(): void {
    try {
      const pdf = new jspdf.jsPDF();

      const columns = ['Title', 'Type', 'Amount', 'Date', 'Added By'];

      let rows = [];
      console.log('coming here', this.allTransactions$);
      // Ensure the observables are defined before subscribing
      if (this.allTransactions$) {
        this.allTransactions$.subscribe((transactions) => {
          rows = transactions.map((transaction) => [
            transaction.title,
            transaction.type,
            transaction.amount,
            transaction.date,
            transaction.addedBy,
          ]);

          pdf.text('CollectiveCoin', 20, 20);
          (pdf as any).autoTable({
            startY: 40,
            head: [columns],
            body: rows,
          });
          pdf.text('Transactions Details :', 20, 35);

          // Ensure the totalItems$ observable is defined before subscribing
          if (this.totalItems$) {
            this.totalItems$.subscribe((total) => {
              pdf.text(`Total Transactions: ${total}`, 20, 200);
            });
          }

          pdf.save('transactions.pdf');
        });
      }
    } catch (error) {
      console.error('Error downloading transactions PDF:', error);
    }
  }
  getFilteredTransactions(): void {
    const formData = this.transactionsservice.filtersForm.value;
    console.log(formData);
    this.store.dispatch(filterTransactions({ formData }));
  }

  nextPage() {
    this.currentPage = this.currentPage + 1;
    this.store.dispatch(loadTransactions());
  }
  previousPage() {
    this.currentPage = this.currentPage - 1;
    this.store.dispatch(loadTransactions());
  }
  changePage(page: number) {
    this.totalItems$.pipe(take(1)).subscribe((totalItems) => {
      const totalPages = Math.ceil(totalItems / 5);
      if (page >= 1 && page <= totalPages) {
        this.currentPage = page;
      }
    });
  }

  clearFilters() {
    console.log('button is clicked');
    this.transactionsservice.filtersForm.reset();
    this.store.dispatch(loadTransactions());
  }
}
