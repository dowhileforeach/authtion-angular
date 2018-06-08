import {Routes} from '@angular/router';

import {PageHomeComponent} from '../../../app/pages/home/page-home.component';
import {PageNotFoundComponent} from '../../../app/pages/not-found/page-not-found.component';


import {AuthtionAccountComponent} from './account/account.component';
import {AuthtionPaymentsComponent} from './account/payments.component';
import {AuthtionProfileComponent} from './account/profile.component';
import {AuthtionPersonalComponent} from './account/personal/personal.component';
import {AuthtionAccountEmailComponent} from './account/email/account-email.component';
import {AuthtionAccountPasswordComponent} from './account/password/page-account-password.component';
import {AuthtionSettingsComponent} from './account/settings.component';
import {AuthtionLoginRegisterWrapComponent} from './login-register/login-register.component';
import {AuthtionResetPassWrapComponent} from './reset-pass/reset-pass.component';
import {AuthtionGuardService} from './authtion-guard.service';

export const authtionRoutes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'login', canActivate: [AuthtionGuardService], component: AuthtionLoginRegisterWrapComponent},
  {path: 'reset-pass', component: AuthtionResetPassWrapComponent},
  {
    path: 'account', canActivate: [AuthtionGuardService], component: AuthtionAccountComponent, children: [
      {path: 'payments', component: AuthtionPaymentsComponent},
      {
        path: 'profile', component: AuthtionProfileComponent, children: [
          {path: 'personal', component: AuthtionPersonalComponent},
          {path: 'email', component: AuthtionAccountEmailComponent},
          {path: 'password', component: AuthtionAccountPasswordComponent},
        ]
      },
      {path: 'settings', component: AuthtionSettingsComponent}
    ]
  },
  {path: '**', component: PageNotFoundComponent},
];
