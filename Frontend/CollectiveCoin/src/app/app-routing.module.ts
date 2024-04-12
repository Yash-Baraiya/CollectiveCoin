import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';
import { RouteGuard } from './route.guard';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { BudgetComponent } from './budget/budget.component';
import { UpdateincomeComponent } from './updateincome/updateincome.component';
import { UpdateexpenseComponent } from './updateexpense/updateexpense.component';
import { UpdatebudgetComponent } from './updatebudget/updatebudget.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'DashBoard',
    component: DashboardComponent,
    canActivate: [RouteGuard],
  },
  {
    path: 'Income',
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
  {
    path: 'Expense',
    children: [
      {
        path: '',
        component: ExpenseComponent,
        canActivate: [RouteGuard],
      },
      {
        path: 'update-expense/:id',
        component: UpdateexpenseComponent,
        canActivate: [RouteGuard],
      },
    ],
  },
  {
    path: 'Transactions',
    component: TransactionsComponent,
    canActivate: [RouteGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'Members',
    component: MembersComponent,
    canActivate: [RouteGuard],
  },
  {
    path: 'resetpassword/:token',
    component: ResetpasswordComponent,
  },
  {
    path: 'Budget',
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
