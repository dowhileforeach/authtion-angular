import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageHomeComponent} from './pages/home/page-home.component';

import {AuthtionPageResetPassWrapComponent} from '@dwfe/modules/authtion/page-reset-pass/page-reset-pass-wrap/page-reset-pass-wrap.component';

const appRoutes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'reset-pass', component: AuthtionPageResetPassWrapComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
