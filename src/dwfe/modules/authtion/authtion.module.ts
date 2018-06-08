import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatInputModule,
  MatTabsModule
} from '@angular/material';

import {RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha';

import {AuthtionBtnUserComponent} from './btn-user/btn-user.component';
import {AuthtionBtnUserLoggedInComponent} from './btn-user/logged-in/logged-in.component';
import {AuthtionBtnUserNotAuthenticatedComponent} from './btn-user/not-authenticated/not-authenticated.component';
import {AuthtionLoginRegisterComponent} from './login-register/login-register.component';
import {AuthtionLoginRegisterWrapComponent} from '@dwfe/modules/authtion/login-register/login-register.component';
import {AuthtionReqResetPassComponent} from './reset-pass/req-reset-pass/req-reset-pass.component';
import {AuthtionResetPassComponent, AuthtionResetPassWrapComponent} from './reset-pass/reset-pass.component';
import {AuthtionExchangeService} from './services/authtion-exchange.service';

import {AuthtionAccountComponent} from '@dwfe/modules/authtion/account/account.component';
import {AuthtionPaymentsComponent} from '@dwfe/modules/authtion/account/payments.component';
import {AuthtionProfileComponent} from './account/profile.component';
import {AuthtionPersonalComponent} from './account/personal/personal.component';
import {AuthtionAccountEmailComponent} from '@dwfe/modules/authtion/account/email/account-email.component';
import {AuthtionAccountPasswordComponent} from '@dwfe/modules/authtion/account/password/page-account-password.component';
import {AuthtionSettingsComponent} from '@dwfe/modules/authtion/account/settings.component';

import {AlertDwfeComponent} from '@dwfe/components/alert/alert.component';
import {InputEmailDwfeComponent} from '@dwfe/components/form-control/input-email/input-email.component';
import {InputPasswordDwfeComponent} from '@dwfe/components/form-control/input-password/input-password.component';
import {SpinnerDottedHorizontalDwfeComponent} from '@dwfe/components/spinner/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleDwfeComponent} from '@dwfe/components/spinner/spinner-shark-fin-circle/spinner-shark-fin-circle.component';
import {AuthtionGuardService} from '@dwfe/modules/authtion/services/authtion-guard.service';
import {AuthtionService} from '@dwfe/modules/authtion/services/authtion.service';

@NgModule({
  declarations: [
    AuthtionBtnUserComponent,
    AuthtionBtnUserNotAuthenticatedComponent,
    AuthtionBtnUserLoggedInComponent,
    AuthtionLoginRegisterComponent,
    AuthtionLoginRegisterWrapComponent,
    AuthtionReqResetPassComponent,
    AuthtionResetPassWrapComponent,
    AuthtionResetPassComponent,
    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,
    AuthtionAccountComponent,
    AuthtionPaymentsComponent,
    AuthtionProfileComponent,
    AuthtionPersonalComponent,
    AuthtionAccountEmailComponent,
    AuthtionAccountPasswordComponent,
    AuthtionSettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatDividerModule,
    RecaptchaModule.forRoot(),
    RouterModule,
  ],
  providers: [
    AuthtionService,
    AuthtionExchangeService,
    AuthtionGuardService,
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
    AuthtionLoginRegisterComponent,
    AuthtionReqResetPassComponent,
    AuthtionResetPassComponent
  ],
})
export class AuthtionModule {
}
