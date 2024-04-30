import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeComponent } from './income.component';
import { UpdateincomeComponent } from '../updateincome/updateincome.component';
import { RouteGuard } from '../shared/route.guard';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(incomeRoutes)],
  exports: [RouterModule],
})
export class IncomeModuleRoutingModule {}
