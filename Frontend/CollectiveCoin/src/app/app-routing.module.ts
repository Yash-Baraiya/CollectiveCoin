import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';
import { RouteGuard } from './route.guard';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { CoverpageComponent } from './coverpage/coverpage.component';

const routes: Routes = [
  {
    path: '',
    component: CoverpageComponent,
  },
  {
    path: 'DashBoard',
    component: DashboardComponent,
    canActivate: [RouteGuard],
  },
  {
    path: 'Income',
    loadChildren: async () => {
      const module = await import('./income/income.module');
      return module.IncomeModule;
    },
  },
  {
    path: 'Expense',
    loadChildren: async () => {
      const module = await import('./expense/expense.module');
      return module.ExpenseModule;
    },
  },
  {
    path: 'Transactions',
    component: TransactionsComponent,
    canActivate: [RouteGuard],
  },
  {
    path: 'Members',
    component: MembersComponent,
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
    path: 'resetpassword/:token',
    component: ResetpasswordComponent,
  },
  {
    path: 'Budget',
    loadChildren: async () => {
      const module = await import('./budget/budget.module');
      return module.BudgetModule;
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
