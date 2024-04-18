// import { Injectable } from '@angular/core';
// import { TransactionService } from '../transaction.service';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import * as transctionactions from './transaction.action';
// import { exhaustMap } from 'rxjs';

// @Injectable()
// export class transactionEffects {
//   loadtransactions = createEffect(() =>
//     this.actions$.pipe(
//       ofType(transctionactions.loadTransactions),
//       exhaustMap(() => this.transactionservice.gettAllTransactions().pipe())
//     )
//   );

//   constructor(
//     private transactionservice: TransactionService,
//     private actions$: Actions
//   ) {}
// }
