import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';

import {AuthtionLoginRegisterComponent} from '../../login-register/login-register.component';

@Component({
  selector: 'app-authtion-btn-user-not-authenticated',
  templateUrl: './not-authenticated.component.html',
})
export class AuthtionBtnUserNotAuthenticatedComponent {

  constructor(protected dialog: MatDialog) {
  }

  private openDialog(): void {
    this.dialog.open( // https://material.angular.io/components/dialog/api
      AuthtionLoginRegisterComponent, {
        autoFocus: false, // prevent autofocusing (default autofocus on field with attribute 'cdkFocusInitial')
        data: {}
      });
  }
}
