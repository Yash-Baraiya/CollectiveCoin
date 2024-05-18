import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { MembersComponent } from './members/members.component';
import { RouteGuard } from './shared/route.guard';
import { ResetpasswordComponent } from './user/resetpassword/resetpassword.component';
import { CoverpageComponent } from './coverpage/coverpage.component';
import { UpdateProfileComponent } from './user/updateProfile/updateProfile.component';
import { NotFoundComponent } from './404/404.component';
import { incomePreloadingStrategy } from './incomeModule/preloading';

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
    path: 'profile',
    component: UpdateProfileComponent,
    canActivate: [RouteGuard],
  },
  {
    path: 'Income',
    loadChildren: async () => {
      const module = await import('./incomeModule/income.module');
      return module.IncomeModule;
    },
    data: { preload: true },
  },
  {
    path: 'Expense',
    loadChildren: async () => {
      const module = await import('./expenseModule/expense.module');
      return module.ExpenseModule;
    },
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
      const module = await import('./budgetModule/budget.module');
      return module.BudgetModule;
    },
  },

  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: incomePreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
