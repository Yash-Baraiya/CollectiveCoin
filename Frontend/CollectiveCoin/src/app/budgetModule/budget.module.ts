import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetComponent } from './budget/budget.component';
import { UpdatebudgetComponent } from './updatebudget/updatebudget.component';
import { SharedModule } from '../shared/shared.module';
import { BudgetModuleRoutingModule } from './budget-module-routing.module';
import { StoreModule } from '@ngrx/store';
import { budgetReducer } from '../store/reducer/budget.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BudgetEffects } from '../store/effect/budget.effect';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';

@NgModule({
  declarations: [BudgetComponent, UpdatebudgetComponent, BarChartComponent],
  imports: [
    CommonModule,
    SharedModule,
    BudgetModuleRoutingModule,
    StoreModule.forFeature('budget', budgetReducer),
    EffectsModule.forFeature([BudgetEffects]),
  ],
  exports: [BarChartComponent],
})
export class BudgetModule {}
