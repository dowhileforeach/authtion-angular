import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthtionPaymentsComponent} from '@dwfe/modules/authtion/account/payments/payments.component';
import {AuthtionSettingsComponent} from '@dwfe/modules/authtion/account/settings/settings.component';
import {AuthtionProfileComponent} from '@dwfe/modules/authtion/account/profile/profile.component';
import {AuthtionPersonalComponent} from '@dwfe/modules/authtion/account/personal/personal.component';
import {AuthtionAccountComponent} from '@dwfe/modules/authtion/account/account.component';
import {AuthtionAccountPasswordComponent} from '@dwfe/modules/authtion/account/password/page-account-password.component';
import {AuthtionAccountEmailComponent} from '@dwfe/modules/authtion/account/email/account-email.component';

const authtionAccountRoutes: Routes = [
  {
    path: '', // account
    component: AuthtionAccountComponent,
    children: [
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
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(authtionAccountRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthtionAccountRoutingModule {
}
