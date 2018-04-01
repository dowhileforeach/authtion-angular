import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PageLoginComponent} from '../../../page/login/page-login.component';

@Component({
  selector: 'app-button-not-authenticated',
  templateUrl: './button-not-authenticated.component.html',
  styleUrls: ['./button-not-authenticated.component.scss']
})
export class ButtonNotAuthenticatedComponent {

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PageLoginComponent, {
      autoFocus: true, // focused on field with attribute 'cdkFocusInitial'
      panelClass: 'login-register-dialog-panel-overriding'
    });
  }
}
