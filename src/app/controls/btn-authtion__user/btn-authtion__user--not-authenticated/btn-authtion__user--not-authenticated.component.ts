import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PageAuthtionLoginRegisterComponent} from '../../../pages/page-authtion__login-register/page-authtion__login-register.component';

@Component({
  selector: 'app-btn-authtion-user-not-authenticated',
  templateUrl: './btn-authtion__user--not-authenticated.component.html',
})
export class BtnAuthtionUserNotAuthenticatedComponent {

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    this.dialog.open(PageAuthtionLoginRegisterComponent, {
      autoFocus: false, // prevent autofocusing (default autofocus on field with attribute 'cdkFocusInitial')
      panelClass: 'cdk-overlay-pane--login-register-dialog-overriding',
      position: {top: '50px'}
    });
  }
}
