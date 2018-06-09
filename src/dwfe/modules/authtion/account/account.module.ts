import {NgModule} from '@angular/core';

import {MatTabsModule} from '@angular/material';

import {DwfeModule} from '@dwfe/modules/dwfe.module';

import {AuthtionPaymentsComponent} from './payments/payments.component';
import {AuthtionProfileComponent} from './profile/profile.component';
import {AuthtionPersonalComponent} from './personal/personal.component';
import {AuthtionAccountComponent} from './account.component';
import {AuthtionAccountPasswordComponent} from './password/page-account-password.component';
import {AuthtionAccountEmailComponent} from './email/account-email.component';
import {AuthtionSettingsComponent} from './settings/settings.component';

import {AuthtionAccountRoutingModule} from './account-routing.module';

@NgModule({
  declarations: [
    AuthtionPaymentsComponent,
    AuthtionAccountComponent,
    AuthtionProfileComponent,
    AuthtionPersonalComponent,
    AuthtionAccountEmailComponent,
    AuthtionAccountPasswordComponent,
    AuthtionSettingsComponent,
  ],
  imports: [
    MatTabsModule,

    DwfeModule,

    AuthtionAccountRoutingModule,
  ]
})
export class AuthtionAccountModule {
}
