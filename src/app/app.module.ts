import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BodyHeaderComponent} from './body/header/header.component';
import {BodyMainComponent} from './body/main/main.component';
import {BodyFooterComponent} from './body/footer/footer.component';
import {PageHomeComponent} from './pages/home/page-home.component';

import {AuthtionService} from './authtion.service';
import {AuthtionUtilsService} from './authtion-utils.service';
import {AuthtionExchangeService} from './authtion-exchange.service';
import {AlertComponent} from './alert/alert.component';
import {BtnAuthtionUserComponent} from './controls/btn-authtion__user/btn-authtion__user.component';
import {BtnAuthtionUserNotAuthenticatedComponent} from './controls/btn-authtion__user/btn-authtion__user--not-authenticated/btn-authtion__user--not-authenticated.component';
import {BtnAuthtionUserLoggedInComponent} from './controls/btn-authtion__user/btn-authtion__user--logged-in/btn-authtion__user--logged-in.component';
import {InputAuthtionEmailComponent} from './controls/input-authtion__email/input-authtion__email.component';
import {InputAuthtionPasswordComponent} from './controls/input-authtion__password/input-authtion__password.component';
import {PageAuthtionLoginRegisterComponent} from './pages/page-authtion__login-register/page-authtion__login-register.component';
import {SpinnerDottedCircleComponent} from './spinners/spinner-dotted-circle/spinner-dotted-circle.component';
import {SpinnerDottedHorizontalComponent} from './spinners/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleComponent} from './spinners/spinner-shark-fin-circle/spinner-shark-fin-circle.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageHomeComponent,
    AlertComponent,
    BtnAuthtionUserComponent,
    BtnAuthtionUserNotAuthenticatedComponent,
    BtnAuthtionUserLoggedInComponent,
    InputAuthtionEmailComponent,
    InputAuthtionPasswordComponent,
    PageAuthtionLoginRegisterComponent,
    SpinnerDottedCircleComponent,
    SpinnerSharkFinCircleComponent,
    SpinnerDottedHorizontalComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  entryComponents: [
    PageAuthtionLoginRegisterComponent
  ],
  providers: [
    AuthtionService,
    AuthtionUtilsService,
    AuthtionExchangeService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
