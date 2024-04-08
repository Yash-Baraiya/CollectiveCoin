import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TokenInterceptor } from './shared/interceptors/custom.interceptor';
import { MembersComponent } from './members/members.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BudgetComponent } from './budget/budget.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { Chart } from 'chart.js';
import { BarCartComponent } from './bar-cart/bar-cart.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    IncomeComponent,
    ExpenseComponent,
    TransactionsComponent,
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    ForgotpasswordComponent,
    MembersComponent,
    BudgetComponent,
    ResetpasswordComponent,
    LineChartComponent,
    BarCartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
