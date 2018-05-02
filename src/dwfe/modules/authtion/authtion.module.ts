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
import {AuthtionPageLoginRegisterComponent} from './page-login-register/page-login-register.component';
import {AuthtionExchangeService} from './services/authtion-exchange.service';

import {AlertDwfeComponent} from '../../components/alert/alert.component';
import {InputEmailDwfeComponent} from '../../components/form-controls/input-email/input-email.component';
import {InputPasswordDwfeComponent} from '../../components/form-controls/input-password/input-password.component';
import {UtilsDwfeService} from '../../services/utils.service';
import {SpinnerDottedHorizontalDwfeComponent} from '../../components/spinners/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleDwfeComponent} from '../../components/spinners/spinner-shark-fin-circle/spinner-shark-fin-circle.component';

@NgModule({
  declarations: [
    AuthtionBtnUserComponent,
    AuthtionBtnUserNotAuthenticatedComponent,
    AuthtionBtnUserLoggedInComponent,
    AuthtionPageLoginRegisterComponent,
    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,
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
    AuthtionExchangeService,
    UtilsDwfeService,
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
