import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthtionLoginRegisterWrapComponent} from './login-register/login-register.component';
import {AuthtionResetPassWrapComponent} from './reset-pass/reset-pass.component';

import {AuthtionGuardService} from './services/authtion-guard.service';

const authtionRoutes: Routes = [
  {path: 'login', canActivate: [AuthtionGuardService], component: AuthtionLoginRegisterWrapComponent},
  {path: 'reset-pass', component: AuthtionResetPassWrapComponent},
  {
    path: 'account',
    canActivate: [AuthtionGuardService],
    loadChildren: './account/account.module#AuthtionAccountModule'
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(authtionRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthtionRoutingModule {
}

