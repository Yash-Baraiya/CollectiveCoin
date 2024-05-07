import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeComponent } from './income/income.component';
import { UpdateincomeComponent } from './updateincome/updateincome.component';
import { RouteGuard } from '../shared/route.guard';
import { LoginComponent } from '../user/login/login.component';

const incomeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: IncomeComponent,
        canActivate: [RouteGuard],
      },
      {
        path: 'update-income/:id',
        component: UpdateincomeComponent,
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
  imports: [RouterModule.forChild(incomeRoutes)],
  exports: [RouterModule],
})
export class IncomeModuleRoutingModule {}
