import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageHomeComponent} from './pages/home/page-home.component';

import {AuthtionPageResetPassWrapComponent} from '@dwfe/modules/authtion/page-reset-pass/page-reset-pass-wrap/page-reset-pass-wrap.component';
import {AuthtionPageAccountComponent} from '@dwfe/modules/authtion/page-account/page-account.component';
import {AuthtionPageAccountSettingsComponent} from '@dwfe/modules/authtion/page-account/page-account-settings/page-account-settings.component';

const appRoutes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'reset-pass', component: AuthtionPageResetPassWrapComponent},
  {
    path: 'account', component: AuthtionPageAccountComponent, children: [
      {path: 'settings', component: AuthtionPageAccountSettingsComponent},
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
