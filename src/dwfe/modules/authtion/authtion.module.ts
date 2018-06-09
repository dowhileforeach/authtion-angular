import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {MAT_DIALOG_DEFAULT_OPTIONS, MatButtonModule, MatDialogModule} from '@angular/material';

import {RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha';

import {DwfeModule} from '@dwfe/modules/dwfe.module';

import {AuthtionBtnUserComponent} from './btn-user/btn-user.component';
import {AuthtionBtnUserLoggedInComponent} from './btn-user/logged-in/logged-in.component';
import {AuthtionBtnUserNotAuthenticatedComponent} from './btn-user/not-authenticated/not-authenticated.component';
import {AuthtionLoginRegisterComponent, AuthtionLoginRegisterWrapComponent} from './login-register/login-register.component';
import {AuthtionReqResetPassComponent} from './reset-pass/req-reset-pass/req-reset-pass.component';
import {AuthtionResetPassComponent, AuthtionResetPassWrapComponent} from './reset-pass/reset-pass.component';

import {AuthtionService} from './services/authtion.service';
import {AuthtionExchangeService} from './services/authtion-exchange.service';
import {AuthtionGuardService} from './services/authtion-guard.service';

import {AuthtionRoutingModule} from './authtion-routing.module';

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
  ],
  imports: [
    HttpClientModule,
    RouterModule,
    RecaptchaModule.forRoot(),

    DwfeModule,

    AuthtionRoutingModule,
  ],
  exports: [
    AuthtionBtnUserComponent,
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
  entryComponents: [
    AuthtionLoginRegisterComponent,
    AuthtionReqResetPassComponent,
    AuthtionResetPassComponent
  ],
})
export class AuthtionModule {
}
