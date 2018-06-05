import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageHomeComponent} from './pages/home/page-home.component';

import {AuthtionPageResetPassWrapComponent} from '@dwfe/modules/authtion/page-reset-pass/page-reset-pass-wrap/page-reset-pass-wrap.component';
import {AuthtionPageAccountComponent} from '@dwfe/modules/authtion/account/page-account.component';
import {AuthtionPageAccountSettingsComponent} from '@dwfe/modules/authtion/account/settings/page-account-settings.component';
import {AuthtionPageAccountSettingsPersonalComponent} from '@dwfe/modules/authtion/account/settings/personal/page-account-settings-personal.component';
import {AuthtionPageAccountSettingsEmailComponent} from '@dwfe/modules/authtion/account/settings/email/page-account-settings-email.component';
import {AuthtionPageAccountSettingsPasswordComponent} from '@dwfe/modules/authtion/account/settings/password/page-account-settings-password.component';
import {AuthtionPageAccountPaymentsComponent} from '@dwfe/modules/authtion/account/payments/page-account-payments.component';

const appRoutes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'reset-pass', component: AuthtionPageResetPassWrapComponent},
  {
    path: 'account', component: AuthtionPageAccountComponent, children: [
      {
        path: 'settings', component: AuthtionPageAccountSettingsComponent, children: [
          {path: 'personal', component: AuthtionPageAccountSettingsPersonalComponent},
          {path: 'email', component: AuthtionPageAccountSettingsEmailComponent},
          {path: 'password', component: AuthtionPageAccountSettingsPasswordComponent},
        ]
      },
      {path: 'payments', component: AuthtionPageAccountPaymentsComponent},
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
