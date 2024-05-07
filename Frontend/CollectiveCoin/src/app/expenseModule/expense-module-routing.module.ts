import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './expense/expense.component';
import { RouteGuard } from '../shared/route.guard';
import { UpdateexpenseComponent } from './updateexpense/updateexpense.component';
import { LoginComponent } from '../user/login/login.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ExpenseComponent,
        canActivate: [RouteGuard],
      },
      {
        path: 'update-expense/:id',
        component: UpdateexpenseComponent,
        canActivate: [RouteGuard]
      },{
        path : '**',
        component: LoginComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseModuleRoutingModule {}
