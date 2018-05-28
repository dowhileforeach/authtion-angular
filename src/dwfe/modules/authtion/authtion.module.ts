import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatButtonModule, MatDialogModule} from '@angular/material';

import {RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha';

import {AuthtionBtnUserComponent} from './btn-user/btn-user.component';
import {AuthtionBtnUserLoggedInComponent} from './btn-user/btn-user--logged-in/btn-user--logged-in.component';
import {AuthtionBtnUserNotAuthenticatedComponent} from './btn-user/btn-user--not-authenticated/btn-user--not-authenticated.component';
import {AuthtionPageLoginRegisterComponent} from './page-login-register/page-login-register.component';
import {AuthtionPageReqRestorePassComponent} from './page-req-restore-pass/page-req-restore-pass.component';
import {AuthtionExchangeService} from './services/authtion-exchange.service';

import {AlertDwfeComponent} from '@dwfe/components/alert/alert.component';
import {InputEmailDwfeComponent} from '@dwfe/components/form-controls/input-email/input-email.component';
import {InputPasswordDwfeComponent} from '@dwfe/components/form-controls/input-password/input-password.component';
import {SpinnerDottedHorizontalDwfeComponent} from '@dwfe/components/spinners/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleDwfeComponent} from '@dwfe/components/spinners/spinner-shark-fin-circle/spinner-shark-fin-circle.component';
import {UtilsDwfeService} from '@dwfe/services/utils.service';

@NgModule({
  declarations: [
    AuthtionBtnUserComponent,
    AuthtionBtnUserNotAuthenticatedComponent,
    AuthtionBtnUserLoggedInComponent,
    AuthtionPageLoginRegisterComponent,
    AuthtionPageReqRestorePassComponent,
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
  ],
  providers: [
    AuthtionExchangeService,
    UtilsDwfeService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        panelClass: 'dwfe-material__dialog-cdk-overlay-pane',
        position: {top: '50px'},
        hasBackdrop: true,
      }
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {siteKey: '6LfGxk4UAAAAAJ9YrW5GuwXosCn1hawNn8YXNaTi'} as RecaptchaSettings
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'en'
    }
  ],
  exports: [
    AuthtionBtnUserComponent,
  ],
  entryComponents: [
    AuthtionPageLoginRegisterComponent,
    AuthtionPageReqRestorePassComponent,
  ],
})
export class AuthtionModule {
}
