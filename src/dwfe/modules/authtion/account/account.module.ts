import {NgModule} from '@angular/core';

import {AuthtionPaymentsComponent} from '@dwfe/modules/authtion/account/payments/payments.component';
import {AuthtionSettingsComponent} from '@dwfe/modules/authtion/account/settings/settings.component';
import {AuthtionProfileComponent} from '@dwfe/modules/authtion/account/profile/profile.component';
import {AuthtionPersonalComponent} from '@dwfe/modules/authtion/account/personal/personal.component';
import {AuthtionAccountComponent} from '@dwfe/modules/authtion/account/account.component';
import {AuthtionAccountPasswordComponent} from '@dwfe/modules/authtion/account/password/page-account-password.component';
import {AuthtionAccountEmailComponent} from '@dwfe/modules/authtion/account/email/account-email.component';

import {AuthtionAccountRoutingModule} from '@dwfe/modules/authtion/account/account-routing.module';
import {MatTabsModule} from '@angular/material';
import {CommonModule} from '@angular/common';

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
