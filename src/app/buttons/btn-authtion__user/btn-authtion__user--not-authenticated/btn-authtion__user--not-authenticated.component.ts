import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PageAuthtionLoginComponent} from '../../../pages/page-authtion-login/page-authtion-login.component';

@Component({
  selector: 'app-btn-authtion-user-not-authenticated',
  templateUrl: './btn-authtion__user--not-authenticated.component.html',
})
export class BtnAuthtionUserNotAuthenticatedComponent {

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    this.dialog.open(PageAuthtionLoginComponent, {
      autoFocus: true, // focused on field with attribute 'cdkFocusInitial'
      panelClass: 'cdk-overlay-pane--login-register-dialog-overriding',
      position: {top: '50px'}
    });
  }
}
