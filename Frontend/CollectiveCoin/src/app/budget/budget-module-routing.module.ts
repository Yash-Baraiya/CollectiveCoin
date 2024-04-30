import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { RouteGuard } from '../shared/route.guard';
import { UpdatebudgetComponent } from '../updatebudget/updatebudget.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BudgetComponent,
        canActivate: [RouteGuard],
      },
      {
        path: 'update-budget/:id',
        component: UpdatebudgetComponent,
        canActivate: [RouteGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetModuleRoutingModule {}
