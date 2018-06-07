import {RouterModule, Routes} from '@angular/router';

import {PageHomeComponent} from './pages/home/page-home.component';
import {PageNotFoundComponent} from './pages/not-found/page-not-found.component';

import {AuthtionResetPassWrapComponent} from '@dwfe/modules/authtion/reset-pass/reset-pass-wrap/reset-pass-wrap.component';

import {AuthtionAccountComponent} from '@dwfe/modules/authtion/account/account.component';
import {AuthtionPaymentsComponent} from '@dwfe/modules/authtion/account/payments.component';
import {AuthtionProfileComponent} from '@dwfe/modules/authtion/account/profile.component';
import {AuthtionPersonalComponent} from '@dwfe/modules/authtion/account/personal/personal.component';
import {AuthtionAccountEmailComponent} from '@dwfe/modules/authtion/account/email/account-email.component';
import {AuthtionAccountPasswordComponent} from '@dwfe/modules/authtion/account/password/page-account-password.component';
import {AuthtionSettingsComponent} from '@dwfe/modules/authtion/account/settings.component';

const appRoutes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'reset-pass', component: AuthtionResetPassWrapComponent},
  {
    path: 'account', component: AuthtionAccountComponent, children: [
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

export const myAccountMenuItemNavigate = '/account/profile/personal';

export const AppRoutes = RouterModule.forRoot(appRoutes);
