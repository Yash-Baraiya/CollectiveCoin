import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';
import { RouteGuard } from './route.guard';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { BudgetComponent } from './budget/budget.component';
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
