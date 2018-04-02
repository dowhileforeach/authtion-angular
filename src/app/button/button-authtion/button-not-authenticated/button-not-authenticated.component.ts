import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PageLoginComponent} from '../../../page/login/page-login.component';
import {Overlay} from '@angular/cdk/overlay';

@Component({
  selector: 'app-button-not-authenticated',
  templateUrl: './button-not-authenticated.component.html',
  styleUrls: ['./button-not-authenticated.component.scss']
})
export class ButtonNotAuthenticatedComponent {

  constructor(public dialog: MatDialog, private overlay: Overlay) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PageLoginComponent, {
      autoFocus: true, // focused on field with attribute 'cdkFocusInitial'
      panelClass: 'cdk-overlay-pane--login-register-dialog-overriding',
      position: {top: '50px'}
    });
  }
}
