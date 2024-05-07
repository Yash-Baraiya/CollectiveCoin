import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './budget/budget.component';
import { RouteGuard } from '../shared/route.guard';
import { UpdatebudgetComponent } from './updatebudget/updatebudget.component';
import { LoginComponent } from '../user/login/login.component';

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
      {
        path: '**',
        component: LoginComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetModuleRoutingModule {}
