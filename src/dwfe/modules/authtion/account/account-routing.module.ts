import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthtionAccountComponent} from './account.component';
import {AuthtionPaymentsComponent} from './payments/payments.component';
import {AuthtionProfileComponent} from './profile/profile.component';
import {AuthtionPersonalComponent} from './personal/personal.component';
import {AuthtionAccountPasswordComponent} from './password/page-account-password.component';
import {AuthtionAccountEmailComponent} from './email/account-email.component';
import {AuthtionSettingsComponent} from './settings/settings.component';

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
