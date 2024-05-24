import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetComponent } from './budget/budget.component';
import { UpdatebudgetComponent } from './updatebudget/updatebudget.component';
import { SharedModule } from '../shared/shared.module';
import { BudgetModuleRoutingModule } from './budget-module-routing.module';
import { StoreModule } from '@ngrx/store';
import { budgetReducer } from './budgetStore/budget.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BudgetEffects } from './budgetStore/budget.effect';

@NgModule({
  declarations: [BudgetComponent, UpdatebudgetComponent],
  imports: [
    CommonModule,
    SharedModule,
    BudgetModuleRoutingModule,
    StoreModule.forFeature('budget', budgetReducer),
    EffectsModule.forFeature([BudgetEffects]),
  ],
})
export class BudgetModule {}
