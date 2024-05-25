import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseModuleRoutingModule } from './expense-module-routing.module';
import { UpdateexpenseComponent } from './updateexpense/updateexpense.component';
import { StoreModule } from '@ngrx/store';
import { expenseReducer } from './expenseStore/expense.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ExpenseEffects } from './expenseStore/expense.effects';

@NgModule({
  declarations: [ExpenseComponent, UpdateexpenseComponent],
  imports: [
    CommonModule,
    SharedModule,
    ExpenseModuleRoutingModule,
    StoreModule.forFeature('expense', expenseReducer),
    EffectsModule.forFeature(ExpenseEffects),
  ],
})
export class ExpenseModule {}
