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
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

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
    component: IncomeComponent,
    canActivate: [RouteGuard],
  },
  {
    path: 'Expense',
    component: ExpenseComponent,
    canActivate: [RouteGuard],
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
    path: 'forgotpassword',
    component: ForgotpasswordComponent,
  },
  {
    path: 'resetpassword/:token',
    component: ResetpasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
