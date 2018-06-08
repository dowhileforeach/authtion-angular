import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatTabsModule} from '@angular/material';

import {RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha';

import {DwfeModule} from '@dwfe/modules/dwfe.module';

import {AuthtionBtnUserComponent} from './btn-user/btn-user.component';
import {AuthtionBtnUserLoggedInComponent} from './btn-user/logged-in/logged-in.component';
import {AuthtionBtnUserNotAuthenticatedComponent} from './btn-user/not-authenticated/not-authenticated.component';
import {AuthtionLoginRegisterComponent} from './login-register/login-register.component';
import {AuthtionLoginRegisterWrapComponent} from '@dwfe/modules/authtion/login-register/login-register.component';
import {AuthtionReqResetPassComponent} from './reset-pass/req-reset-pass/req-reset-pass.component';
import {AuthtionResetPassComponent, AuthtionResetPassWrapComponent} from './reset-pass/reset-pass.component';

import {AuthtionAccountComponent} from '@dwfe/modules/authtion/account/account.component';
import {AuthtionPaymentsComponent} from '@dwfe/modules/authtion/account/payments.component';
import {AuthtionProfileComponent} from './account/profile.component';
import {AuthtionPersonalComponent} from './account/personal/personal.component';
import {AuthtionAccountEmailComponent} from '@dwfe/modules/authtion/account/email/account-email.component';
import {AuthtionAccountPasswordComponent} from '@dwfe/modules/authtion/account/password/page-account-password.component';
import {AuthtionSettingsComponent} from '@dwfe/modules/authtion/account/settings.component';

import {AuthtionService} from '@dwfe/modules/authtion/services/authtion.service';
import {AuthtionExchangeService} from './services/authtion-exchange.service';
import {AuthtionGuardService} from '@dwfe/modules/authtion/services/authtion-guard.service';

import {AuthtionRoutingModule} from '@dwfe/modules/authtion/authtion-routing.module';

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
    HttpClientModule,
    RouterModule,

    MatDialogModule,
    MatTabsModule,

    RecaptchaModule.forRoot(),

    DwfeModule,

    AuthtionRoutingModule,
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
