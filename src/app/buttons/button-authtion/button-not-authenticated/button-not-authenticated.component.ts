import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PageAuthtionLoginComponent} from '../../../pages/page-authtion-login/page-authtion-login.component';

@Component({
  selector: 'app-button-not-authenticated',
  templateUrl: './button-not-authenticated.component.html',
  styleUrls: ['./button-not-authenticated.component.scss']
})
export class ButtonNotAuthenticatedComponent {

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
