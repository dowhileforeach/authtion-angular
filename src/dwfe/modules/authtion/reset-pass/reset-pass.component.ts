import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';
import {
  AuthtionExchangeService,
  ConfirmResetPassExchanger,
  ResetPassExchanger
} from '@dwfe/modules/authtion/services/authtion-exchange.service';
import {AuthtionLoginRegisterComponent} from '@dwfe/modules/authtion/login-register/login-register.component';
import {ActivatedRoute, Router} from '@angular/router';

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

  private groupNewPassword = new FormGroup({});
  private controlNewPassword: AbstractControl;
  @ViewChild('refNewPassword', {read: ElementRef}) private refNewPassword: ElementRef;

  private groupRepeatNewPassword = new FormGroup({});
  private controlRepeatNewPassword: AbstractControl;
  @ViewChild('refRepeatNewPassword', {read: ElementRef}) private refRepeatNewPassword: ElementRef;

  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  @ViewChild('refGoToLoginPage', {read: ElementRef}) refGoToLoginPage: ElementRef;

  constructor(protected exchangeService: AuthtionExchangeService,
              protected dialog: MatDialog,
              protected dialogRef: MatDialogRef<AuthtionResetPassComponent>,
              @Inject(MAT_DIALOG_DATA) protected data: any,
              protected router: Router) {
    super();

    this.key = this.data.key;
    this.setIsPreparingSuccessfull(this.key !== 'none');
  }

  public setIsPreparingSuccessfull(value: boolean): void {
    this.isPreparingSuccessfull = value;
    this.subjIsPreparingSuccessfull.next(value);
  }

  public setIsReqSuccessful(value: boolean): void {
    this.isReqSuccessful = value;
    this.subjIsReqSuccessful.next(value);
  }

  ngAfterViewInit(): void {
    setTimeout(() => { // to prevent multiple ExpressionChangedAfterItHasBeenCheckedError

      if (this.isPreparingSuccessfull) {
        ConfirmResetPassExchanger.of(this.exchangeService.http)
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
        takeUntil(this.latchForUnsubscribe.asObservable())
      )
      .subscribe(value => {
        if (value) {
          this.controlNewPassword = this.groupNewPassword.get('password');
          this.controlRepeatNewPassword = this.groupRepeatNewPassword.get('password');
          this.resetBackendError('controlNewPassword', ['errorMessage'], this.latchForUnsubscribe.asObservable());
          this.resetBackendError('controlRepeatNewPassword', ['errorMessage'], this.latchForUnsubscribe.asObservable());
          this.focusOnDwfeInput(this.refNewPassword);
        }
      });

    this.subjIsReqSuccessful
      .pipe(
        takeUntil(this.latchForUnsubscribe.asObservable())
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

  public setLocked(value: boolean): void {
    super.setLocked(value);
    if (value) {
      this.refPendingOverlayWrap.nativeElement.focus();
    } else {
    }
  }

  private performResetPassword(): void {
    if (this.controlNewPassword.value !== this.controlRepeatNewPassword.value) {
      this.errorMessage = 'New Password and Repeat do not match';
      return;
    }

    ResetPassExchanger.of(this.exchangeService.http)
      .run(this,
        `{ "email": "${this.email}",
           "key": "${this.key}",
           "newpass": "${this.controlNewPassword.value}" }`,
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
    this.dialogRef.close();
    this.dialog.open( // https://material.angular.io/components/dialog/api
      AuthtionLoginRegisterComponent, {
        autoFocus: false,
        data: {
          email: this.email
        }
      });
  }
}

@Component({
  selector: 'app-authtion-reset-pass-wrap',
  template: ``
})
export class AuthtionResetPassWrapComponent implements OnInit, AfterViewInit {

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
