import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import {
  TransactionState,
  transactionReducer,
} from './../store/reducer/transactions.reducer';
import {
  deleteTransaction,
  filterTransactions,
  loadTransactions,
} from '../store/actions/transactions.action';
import {
  selectAllTransactions,
  selectTotalTransactions,
} from '../store/selectors/transactions.selector';
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
    this.allTransactions$.subscribe(() => {});
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

      if (this.allTransactions$) {
        this.allTransactions$.subscribe((transactions) => {
          rows = transactions.map((transaction) => [
            transaction.title,
            transaction.type,
            transaction.amount,
            transaction.date,
            transaction.addedBy,
          ]);

          const logoUrl = 'https://img.icons8.com/matisse/100/rupee.png';

          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const imgWidth = 30;
            const imgHeight = 20;
            const imgX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
            const imgY = 10;
            pdf.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

            pdf.text('CollectiveCoin', imgX - 4, imgY + 25);

            pdf.text('Transactions Details', 20, imgY + 52);

            (pdf as any).autoTable({
              startY: imgY + 62,
              head: [columns],
              body: rows,
            });

            pdf.text(
              'Total Transactions:',
              20,
              pdf.internal.pageSize.getHeight() - 20
            );

            if (this.totalItems$) {
              this.totalItems$.subscribe((total) => {
                pdf.text(
                  `${total}`,
                  70,
                  pdf.internal.pageSize.getHeight() - 20
                );
              });
            }

            pdf.save('transactions.pdf');
          };
          img.src = logoUrl;
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
