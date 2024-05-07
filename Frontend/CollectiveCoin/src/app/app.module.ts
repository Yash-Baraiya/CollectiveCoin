import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './shared/interceptors/custom.interceptor';
import { MembersComponent } from './members/members.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { CoverpageComponent } from './coverpage/coverpage.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducer } from './members/memberstore/members.reducer';
import { MembersEffects } from './members/memberstore/members.effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UpdateProfileComponent } from './user/updateProfile/updateProfile.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotFoundComponent } from './404/404.component';

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
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    StoreModule.forRoot({ members: reducer }),
    EffectsModule.forRoot([MembersEffects]),
    SharedModule,
    NgxSpinnerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideAnimationsAsync(),
    DatePipe,
    provideAnimationsAsync('noop'),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
