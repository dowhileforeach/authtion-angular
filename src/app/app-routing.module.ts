import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageHomeComponent} from './pages/home/page-home.component';

import {AuthtionPageRestorePassWrapComponent} from '@dwfe/modules/authtion/page-restore-pass/page-restore-pass-wrap/page-restore-pass-wrap.component';

const appRoutes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'restore-pass', component: AuthtionPageRestorePassWrapComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
