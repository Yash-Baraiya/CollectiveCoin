import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class totalIncomeService {
  private totalIncomeSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  totalIncome$ = this.totalIncomeSubject.asObservable();

  updateTotalIncome(totalIncome: number) {
    this.totalIncomeSubject.next(totalIncome);

    console.log(totalIncome);
  }
}
