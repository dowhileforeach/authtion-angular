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

import {AlertComponent} from '../dwfe/alert/alert.component';

import {AuthtionService} from '../dwfe/modules/authtion/services/authtion.service';
import {AuthtionUtilsService} from '../dwfe/modules/authtion/services/authtion-utils.service';
import {AuthtionExchangeService} from '../dwfe/modules/authtion/services/authtion-exchange.service';
import {AuthtionBtnUserComponent} from '../dwfe/modules/authtion/btn-user/btn-user.component';
import {AuthtionBtnUserNotAuthenticatedComponent} from '../dwfe/modules/authtion/btn-user/btn-user--not-authenticated/btn-user--not-authenticated.component';
import {AuthtionBtnUserLoggedInComponent} from '../dwfe/modules/authtion/btn-user/btn-user--logged-in/btn-user--logged-in.component';
import {AuthtionInputEmailComponent} from '../dwfe/modules/authtion/input-email/input-email.component';
import {AuthtionInputPasswordComponent} from '../dwfe/modules/authtion/input-password/input-password.component';
import {AuthtionPageLoginRegisterComponent} from '../dwfe/modules/authtion/page-login-register/page-login-register.component';

import {SpinnerDottedCircleComponent} from '../dwfe/spinners/spinner-dotted-circle/spinner-dotted-circle.component';
import {SpinnerDottedHorizontalComponent} from '../dwfe/spinners/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleComponent} from '../dwfe/spinners/spinner-shark-fin-circle/spinner-shark-fin-circle.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageHomeComponent,
    AlertComponent,
    AuthtionBtnUserComponent,
    AuthtionBtnUserNotAuthenticatedComponent,
    AuthtionBtnUserLoggedInComponent,
    AuthtionInputEmailComponent,
    AuthtionInputPasswordComponent,
    AuthtionPageLoginRegisterComponent,
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
    AuthtionPageLoginRegisterComponent
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
