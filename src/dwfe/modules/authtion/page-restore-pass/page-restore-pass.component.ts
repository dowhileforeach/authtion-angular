import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';
import {
  AuthtionExchangeService,
  ConfirmRestorePassExchanger,
  RestorePassExchanger
} from '@dwfe/modules/authtion/services/authtion-exchange.service';
import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

@Component({
  selector: 'app-authtion-page-restore-pass',
  templateUrl: './page-restore-pass.component.html',
  styleUrls: ['./page-restore-pass.component.scss']
})
export class AuthtionPageRestorePassComponent extends AbstractExchangeableDwfe implements AfterViewInit, OnDestroy {

  private key: string;
  private email: string;

  private isPreparingSuccessfull: boolean;
  private subjIsPreparingSuccessfull = new Subject();

  private isReqSuccessful = false;

  private groupNewPassword = new FormGroup({});
  private controlNewPassword: AbstractControl;
  @ViewChild('refNewPassword', {read: ElementRef}) private refNewPassword: ElementRef;

  private groupRepeatNewPassword = new FormGroup({});
  private controlRepeatNewPassword: AbstractControl;
  @ViewChild('refRepeatNewPassword', {read: ElementRef}) private refRepeatNewPassword: ElementRef;

  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;

  private latchForUnsubscribe = new Subject();

  private resetBackendError = UtilsDwfe.resetBackendError;

  constructor(protected exchangeService: AuthtionExchangeService,
              @Inject(MAT_DIALOG_DATA) protected data: any) {
    super();

    this.key = this.data.key;
    this.setIsPreparingSuccessfull(this.key !== 'none');
  }

  ngOnDestroy(): void {
    this.latchForUnsubscribe.next();
  }

  public setIsPreparingSuccessfull(value: boolean): void {
    this.isPreparingSuccessfull = value;
    this.subjIsPreparingSuccessfull.next(value);
  }

  ngAfterViewInit(): void {
    setTimeout(() => { // to prevent multiple Error:
      // ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after

      if (this.isPreparingSuccessfull) {
        ConfirmRestorePassExchanger.of(this.exchangeService.http)
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
        this.errorMessage = 'Confirmation key is wrong';
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
        }
      });
  }

  public setLocked(value: boolean): void {
    super.setLocked(value);
    if (value) {
      this.refPendingOverlayWrap.nativeElement.focus();
    } else {
    }
  }

  public performRestorePassword(): void {
    if (this.controlNewPassword.value !== this.controlRepeatNewPassword.value) {
      this.errorMessage = 'New Password and Repeat do not match';
      return;
    }

    RestorePassExchanger.of(this.exchangeService.http)
      .run(this,
        `{ "email": "${this.email}",
           "key": "${this.key}",
           "newpass": "${this.controlNewPassword.value}" }`,
        (data: ResultWithDescription) => {
          if (data.result) {
            this.isReqSuccessful = true;
          } else {
            this.errorMessage = data.description;
          }
        }
      );
  }
}
