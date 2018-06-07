import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';

import {AuthtionPageResetPassComponent} from '@dwfe/modules/authtion/reset-pass/page-reset-pass.component';

@Component({
  selector: 'app-authtion-page-reset-pass-wrap',
  template: '',
})
export class AuthtionPageResetPassWrapComponent implements OnInit, AfterViewInit {

  private key: string;

  constructor(protected route: ActivatedRoute,
              protected dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(
      params => this.key = params.get('key') || 'none'
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dialog.open( // https://material.angular.io/components/dialog/api
        AuthtionPageResetPassComponent, {
          autoFocus: false,
          data: {
            key: this.key
          }
        });
    }, 10); // to prevent error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed
            // after it was checked. Previous value: 'id: undefined'. Current value: 'id: mat-dialog-0'.
  }

}
