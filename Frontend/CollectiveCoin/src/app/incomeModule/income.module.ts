import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeComponent } from './income/income.component';
import { SharedModule } from '../shared/shared.module';
import { IncomeModuleRoutingModule } from './income-module-routing.module';
import { UpdateincomeComponent } from './updateincome/updateincome.component';
import { StoreModule } from '@ngrx/store';
import { incomeReducer } from '../store/reducer/income.reducer';
import { IncomeEffects } from '../store/effect/income.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [IncomeComponent, UpdateincomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    IncomeModuleRoutingModule,
    StoreModule.forFeature('income', incomeReducer),
    EffectsModule.forFeature([IncomeEffects]),
  ],
})
export class IncomeModule {
  constructor() {
    console.log('income module loaded');
  }
}
