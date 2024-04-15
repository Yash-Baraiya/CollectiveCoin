import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeComponent } from './income.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { IncomeModuleRoutingModule } from './income-module-routing.module';
import { UpdateincomeComponent } from '../updateincome/updateincome.component';

@NgModule({
  declarations: [IncomeComponent, UpdateincomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IncomeModuleRoutingModule,
  ],
})
export class IncomeModule {
  constructor() {
    console.log('income module loaded');
  }
}
