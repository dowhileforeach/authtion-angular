import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';

import {AuthtionExchangeService} from '../services/authtion-exchange.service';
import {AuthtionLoginRegisterComponent} from '../login-register/login-register.component';

@Component({
  selector: 'app-authtion-reset-pass',
  templateUrl: './reset-pass.component.html'
})
export class AuthtionResetPassComponent extends AbstractExchangeableDwfe implements AfterViewInit, OnDestroy {

  private key: string;
  private email: string;

  private isPreparingSuccessfull: boolean;
  private subjIsPreparingSuccessfull = new Subject();

  private isReqSuccessful = false;
  private subjIsReqSuccessful = new Subject();

  private cNewPassword: AbstractControl;
  @ViewChild('refNewPassword', {read: ElementRef}) private refNewPassword: ElementRef;

  private cRepeatNewPassword: AbstractControl;

  @ViewChild('refGoToLoginPage', {read: ElementRef}) refGoToLoginPage: ElementRef;

  constructor(private exchangeService: AuthtionExchangeService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<AuthtionResetPassComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private router: Router) {
    super();

    this.key = this.data.key;
    this.setIsPreparingSuccessfull(this.key !== 'none');
  }

  private setIsPreparingSuccessfull(value: boolean): void {
    this.isPreparingSuccessfull = value;
    this.subjIsPreparingSuccessfull.next(value);
  }

  private setIsReqSuccessful(value: boolean): void {
    this.isReqSuccessful = value;
    this.subjIsReqSuccessful.next(value);
  }

  ngAfterViewInit(): void {
    setTimeout(() => { // to prevent multiple ExpressionChangedAfterItHasBeenCheckedError

      if (this.isPreparingSuccessfull) {
        this.exchangeService.confirmResetPassExchanger
          .run(this,
            `{ "key": "${this.key}" }`,
            (data: ResultWithDescription) => {
              if (data.result) {
                this.email = data.data['email'];
                this.setIsPreparingSuccessfull(true);
              } else {
                this.errorMessage = data.description;
                this.setIsPreparingSuccessfull(false);
              }
            });
      } else {
        this.errorMessage = 'Confirm key is wrong';
      }

    }, 10);

    this.subjIsPreparingSuccessfull
      .pipe(
        takeUntil(this.latchForUnsubscribe)
      )
      .subscribe(value => {
        if (value) {
          this.resetBackendError('cNewPassword', ['errorMessage'], this.latchForUnsubscribe);
          this.resetBackendError('cRepeatNewPassword', ['errorMessage'], this.latchForUnsubscribe);
          this.focusOnDwfeInput(this.refNewPassword);
        }
      });

    this.subjIsReqSuccessful
      .pipe(
        takeUntil(this.latchForUnsubscribe)
      )
      .subscribe(value => {
          setTimeout(() => { // wait for the element to appear in the DOM
            if (value) {
              this.refGoToLoginPage.nativeElement.focus();
            }
          }, 100);
        }
      );

    this.dialogRef.afterClosed().subscribe(() => this.router.navigate(['/']));
  }

  private performResetPassword(): void {
    if (this.cNewPassword.value !== this.cRepeatNewPassword.value) {
      this.errorMessage = 'New Password and Repeat do not match';
      return;
    }

    this.exchangeService.resetPassExchanger
      .run(this,
        `{ "email": "${this.email}",
           "key": "${this.key}",
           "newpass": "${this.cNewPassword.value}" }`,
        (data: ResultWithDescription) => {
          if (data.result) {
            this.setIsReqSuccessful(true);
          } else {
            this.errorMessage = data.description;
          }
        }
      );
  }

  private goToLoginPage(): void {
    this.dialog.open( // https://material.angular.io/components/dialog/api
      AuthtionLoginRegisterComponent, {
        autoFocus: false,
        data: {
          email: this.email
        }
      });
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-authtion-reset-pass-wrap',
  template: ``
})
export class AuthtionResetPassWrapComponent implements OnInit, AfterViewInit {

  private key: string;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(
      params => this.key = params.get('key') || 'none'
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dialog.open( // https://material.angular.io/components/dialog/api
        AuthtionResetPassComponent, {
          autoFocus: false,
          data: {
            key: this.key
          }
        });
    }, 10); // to prevent error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed
            // after it was checked. Previous value: 'id: undefined'. Current value: 'id: mat-dialog-0'.
  }
}
