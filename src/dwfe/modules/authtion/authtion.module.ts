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
import {AuthtionBtnUserLoggedInComponent} from './btn-user/btn-user--logged-in/btn-user--logged-in.component';
import {AuthtionBtnUserNotAuthenticatedComponent} from './btn-user/btn-user--not-authenticated/btn-user--not-authenticated.component';
import {AuthtionPageLoginRegisterComponent} from './page-login-register/page-login-register.component';
import {AuthtionPageReqResetPassComponent} from './page-req-reset-pass/page-req-reset-pass.component';
import {AuthtionExchangeService} from './services/authtion-exchange.service';
import {AuthtionPageResetPassWrapComponent} from './page-reset-pass/page-reset-pass-wrap/page-reset-pass-wrap.component';
import {AuthtionPageResetPassComponent} from './page-reset-pass/page-reset-pass.component';

import {AlertDwfeComponent} from '@dwfe/components/alert/alert.component';
import {InputEmailDwfeComponent} from '@dwfe/components/form-control/input-email/input-email.component';
import {InputPasswordDwfeComponent} from '@dwfe/components/form-control/input-password/input-password.component';
import {SpinnerDottedHorizontalDwfeComponent} from '@dwfe/components/spinner/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleDwfeComponent} from '@dwfe/components/spinner/spinner-shark-fin-circle/spinner-shark-fin-circle.component';
import {AuthtionPageAccountComponent} from '@dwfe/modules/authtion/account/page-account.component';
import {AuthtionPageAccountSettingsComponent} from '@dwfe/modules/authtion/account/settings/page-account-settings.component';
import {AuthtionPageAccountSettingsEmailComponent} from '@dwfe/modules/authtion/account/settings/email/page-account-settings-email.component';
import {AuthtionPageAccountSettingsPersonalComponent} from '@dwfe/modules/authtion/account/settings/personal/page-account-settings-personal.component';
import {AuthtionPageAccountSettingsPasswordComponent} from '@dwfe/modules/authtion/account/settings/password/page-account-settings-password.component';
import {AuthtionPageAccountPaymentsComponent} from '@dwfe/modules/authtion/account/payments/page-account-payments.component';

@NgModule({
  declarations: [
    AuthtionBtnUserComponent,
    AuthtionBtnUserNotAuthenticatedComponent,
    AuthtionBtnUserLoggedInComponent,
    AuthtionPageLoginRegisterComponent,
    AuthtionPageReqResetPassComponent,
    AuthtionPageResetPassWrapComponent,
    AuthtionPageResetPassComponent,
    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,
    AuthtionPageAccountComponent,
    AuthtionPageAccountSettingsComponent,
    AuthtionPageAccountSettingsPersonalComponent,
    AuthtionPageAccountSettingsEmailComponent,
    AuthtionPageAccountSettingsPasswordComponent,
    AuthtionPageAccountPaymentsComponent,
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
    AuthtionExchangeService,
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
    AuthtionPageReqResetPassComponent,
    AuthtionPageResetPassComponent
  ],
})
export class AuthtionModule {
}
