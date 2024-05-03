import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ExpenseComponent } from './expense/expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseModuleRoutingModule } from './expense-module-routing.module';
import { UpdateexpenseComponent } from './updateexpense/updateexpense.component';

@NgModule({
  declarations: [ExpenseComponent, UpdateexpenseComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ExpenseModuleRoutingModule,
  ],
})
export class ExpenseModule {}
