import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetComponent } from './budget/budget.component';
import { UpdatebudgetComponent } from './updatebudget/updatebudget.component';
import { SharedModule } from '../shared/shared.module';
import { BudgetModuleRoutingModule } from './budget-module-routing.module';

@NgModule({
  declarations: [BudgetComponent, UpdatebudgetComponent],
  imports: [CommonModule, SharedModule, BudgetModuleRoutingModule],
})
export class BudgetModule {}
