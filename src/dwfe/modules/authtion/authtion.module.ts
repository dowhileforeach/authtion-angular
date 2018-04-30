import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatButtonModule, MatDialogModule} from '@angular/material';

import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';

import {AuthtionBtnUserComponent} from './btn-user/btn-user.component';
import {AuthtionBtnUserLoggedInComponent} from './btn-user/btn-user--logged-in/btn-user--logged-in.component';
import {AuthtionBtnUserNotAuthenticatedComponent} from './btn-user/btn-user--not-authenticated/btn-user--not-authenticated.component';
import {AuthtionInputEmailComponent} from './input-email/input-email.component';
import {AuthtionInputPasswordComponent} from './input-password/input-password.component';

import {AuthtionPageLoginRegisterComponent} from './page-login-register/page-login-register.component';

import {AuthtionUtilsService} from './services/authtion-utils.service';
import {AuthtionExchangeService} from './services/authtion-exchange.service';

import {AlertDwfeComponent} from '../../alert/alert.component';

import {SpinnerDottedHorizontalComponent} from '../../spinners/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleComponent} from '../../spinners/spinner-shark-fin-circle/spinner-shark-fin-circle.component';

@NgModule({
  declarations: [
    AuthtionBtnUserComponent,
    AuthtionBtnUserNotAuthenticatedComponent,
    AuthtionBtnUserLoggedInComponent,
    AuthtionInputEmailComponent,
    AuthtionInputPasswordComponent,
    AuthtionPageLoginRegisterComponent,
    AlertDwfeComponent,
    SpinnerDottedHorizontalComponent,
    SpinnerSharkFinCircleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
  ],
  providers: [
    AuthtionUtilsService,
    AuthtionExchangeService,
  ],
  exports: [
    AuthtionBtnUserComponent,
  ],
  entryComponents: [
    AuthtionPageLoginRegisterComponent
  ],
})
export class AuthtionModule {
}
