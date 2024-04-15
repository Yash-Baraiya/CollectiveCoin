import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetComponent } from './budget.component';
import { UpdatebudgetComponent } from '../updatebudget/updatebudget.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { BudgetModuleRoutingModule } from './budget-module-routing.module';

@NgModule({
  declarations: [BudgetComponent, UpdatebudgetComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    BudgetModuleRoutingModule,
  ],
})
export class BudgetModule {}
