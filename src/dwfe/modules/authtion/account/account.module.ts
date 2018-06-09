import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatTabsModule} from '@angular/material';

import {AuthtionPaymentsComponent} from './payments/payments.component';
import {AuthtionSettingsComponent} from './settings/settings.component';
import {AuthtionProfileComponent} from './profile/profile.component';
import {AuthtionPersonalComponent} from './personal/personal.component';
import {AuthtionAccountComponent} from './account.component';
import {AuthtionAccountPasswordComponent} from './password/page-account-password.component';
import {AuthtionAccountEmailComponent} from './email/account-email.component';

import {AuthtionAccountRoutingModule} from './account-routing.module';

@NgModule({
  declarations: [
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
    MatTabsModule,

    AuthtionAccountRoutingModule,
  ]
})
export class AuthtionAccountModule {
}
