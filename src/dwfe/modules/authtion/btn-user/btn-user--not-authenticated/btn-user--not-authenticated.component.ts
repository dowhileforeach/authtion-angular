import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';

import {AuthtionPageLoginRegisterComponent} from '../../page-login-register/page-login-register.component';

@Component({
  selector: 'app-authtion-btn-user-not-authenticated',
  templateUrl: './btn-user--not-authenticated.component.html',
})
export class AuthtionBtnUserNotAuthenticatedComponent {

  constructor(private dialog: MatDialog) {
  }

  private openDialog(): void {
    this.dialog.open( // https://material.angular.io/components/dialog/api
      AuthtionPageLoginRegisterComponent, {
        autoFocus: false, // prevent autofocusing (default autofocus on field with attribute 'cdkFocusInitial')
      });
  }
}
