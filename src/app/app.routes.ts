import {RouterModule, Routes} from '@angular/router';

import {PageHomeComponent} from './pages/home/page-home.component';
import {PageNotFoundComponent} from './pages/not-found/page-not-found.component';


import {AuthtionAccountComponent} from '@dwfe/modules/authtion/account/account.component';
import {AuthtionPaymentsComponent} from '@dwfe/modules/authtion/account/payments.component';
import {AuthtionProfileComponent} from '@dwfe/modules/authtion/account/profile.component';
import {AuthtionPersonalComponent} from '@dwfe/modules/authtion/account/personal/personal.component';
import {AuthtionAccountEmailComponent} from '@dwfe/modules/authtion/account/email/account-email.component';
import {AuthtionAccountPasswordComponent} from '@dwfe/modules/authtion/account/password/page-account-password.component';
import {AuthtionSettingsComponent} from '@dwfe/modules/authtion/account/settings.component';
import {AuthtionLoginRegisterWrapComponent} from '@dwfe/modules/authtion/login-register/login-register.component';
import {AuthtionResetPassWrapComponent} from '@dwfe/modules/authtion/reset-pass/reset-pass.component';
import {AuthGuardService} from './auth-guard.service';

const appRoutes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'login', canActivate: [AuthGuardService], component: AuthtionLoginRegisterWrapComponent},
  {path: 'reset-pass', component: AuthtionResetPassWrapComponent},
  {
    path: 'account', canActivate: [AuthGuardService], component: AuthtionAccountComponent, children: [
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

export const AppRoutes = RouterModule.forRoot(appRoutes);
