import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetComponent } from './budget/budget.component';
import { UpdatebudgetComponent } from './updatebudget/updatebudget.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { BudgetModuleRoutingModule } from './budget-module-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [BudgetComponent, UpdatebudgetComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    BudgetModuleRoutingModule,
    NgxPaginationModule,
  ],
})
export class BudgetModule {}
