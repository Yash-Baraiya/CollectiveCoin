import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './shared/interceptors/custom.interceptor';
import { MembersComponent } from './members/members.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ResetpasswordComponent } from './user/resetpassword/resetpassword.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { CoverpageComponent } from './coverpage/coverpage.component';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { reducer as membersReducer } from './store/reducer/members.reducer';
import { MembersEffects } from './store/effect/members.effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UpdateProfileComponent } from './user/updateProfile/updateProfile.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotFoundComponent } from './404/404.component';
import { reducer as transactionReducer } from './store/reducer/transactions.reducer';
import { TransactionEffects } from './store/effect/transactions.effects';
import { incomeReducer } from './store/reducer/income.reducer';
import { IncomeEffects } from './store/effect/income.effects';
import { budgetReducer } from './store/reducer/budget.reducer';
import { BudgetEffects } from './store/effect/budget.effect';
import { expenseReducer } from './store/reducer/expense.reducer';
import { ExpenseEffects } from './store/effect/expense.effects';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TransactionsComponent,
    LoginComponent,
    SignupComponent,
    MembersComponent,
    ResetpasswordComponent,
    LineChartComponent,
    CoverpageComponent,
    UpdateProfileComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('members', membersReducer),
    StoreModule.forFeature('income', incomeReducer),
    StoreModule.forFeature('budget', budgetReducer),
    StoreModule.forFeature('transactions', transactionReducer),
    StoreModule.forFeature('expense', expenseReducer),
    EffectsModule.forRoot([MembersEffects, TransactionEffects]),
    EffectsModule.forFeature([IncomeEffects, BudgetEffects, ExpenseEffects]),
    SharedModule,
    NgxSpinnerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideAnimationsAsync(),
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
