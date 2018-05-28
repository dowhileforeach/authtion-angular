import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';

import {Subscription} from 'rxjs/index';

import {AuthtionExchangeService} from '@dwfe/modules/authtion/services/authtion-exchange.service';
import {UtilsDwfeService} from '@dwfe/services/utils.service';

@Component({
  selector: 'app-authtion-page-req-restore-pass',
  templateUrl: './page-req-restore-pass.component.html',
  styleUrls: ['./page-req-restore-pass.component.scss']
})
export class AuthtionPageReqRestorePassComponent implements AfterViewInit, OnDestroy {

  private isReqSuccessful = false;

  private groupAccountEmail = new FormGroup({});
  private controlAccountEmail: AbstractControl;
  @ViewChild('refAccountEmail', {read: ElementRef}) private refAccountEmail: ElementRef;

  private isLocked = false;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  private errorMessageOfProcess = '';

  private isCaptchaValid = false;
  private errorMessageOfCaptcha = '';

  private subscription_googleCaptchaValidate: Subscription;
  private subscription_reqRestorePass: Subscription;
  private subscription_emailChangesAccountResetBackendError: Subscription;

  private resetBackendError = UtilsDwfeService.resetBackendError;
  private focusOnDwfeInput = UtilsDwfeService.focusOnDwfeInput;

  constructor(public exchangeService: AuthtionExchangeService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngAfterViewInit(): void {
    this.controlAccountEmail = this.groupAccountEmail.get('email');
    setTimeout(() => this.controlAccountEmail.setValue(this.data.email), 10);

    this.subscription_emailChangesAccountResetBackendError = this.resetBackendError('controlAccountEmail', ['errorMessageOfProcess', 'errorMessageOfCaptcha']);
  }

  ngOnDestroy(): void {
    if (this.subscription_googleCaptchaValidate) {
      this.subscription_googleCaptchaValidate.unsubscribe();
    }
    if (this.subscription_reqRestorePass) {
      this.subscription_reqRestorePass.unsubscribe();
    }
    this.subscription_emailChangesAccountResetBackendError.unsubscribe();
  }

  private setLocked(value: boolean): void {

    this.isLocked = value;

    if (value) {
      this.refPendingOverlayWrap.nativeElement.focus();
    } else {
      this.focusOnDwfeInput(this.refAccountEmail);
    }
  }

  public googleCaptchaResolved(googleResponse: string): void {

    this.errorMessageOfCaptcha = ''; // init

    if (googleResponse === null) {
      this.isCaptchaValid = false;
      return;
    }

    // let's run the verification process
    this.exchangeService.performGoogleCaptchaValidate(googleResponse);

    // wait for service response
    this.setLocked(true);

    // process service response
    this.subscription_googleCaptchaValidate = this.exchangeService.perform__googleCaptchaValidate.subscribe(
      data => {
        if (data.result) { // actions on success captcha check
          this.isCaptchaValid = true;
        } else {
          this.errorMessageOfCaptcha = data.description;
        }
        this.subscription_googleCaptchaValidate.unsubscribe();
        this.setLocked(false);
      }
    );
  }

  private performReqRestorePass(): void {
    this.errorMessageOfProcess = ''; // init

    // password restore request performs authtion-exchange.service, give it a email
    this.exchangeService.performReqRestorePass(this.controlAccountEmail.value);

    // wait for service response
    this.setLocked(true);

    // process service response
    this.subscription_reqRestorePass = this.exchangeService.perform__reqRestorePass.subscribe(
      data => {
        if (data.result) { // actions on success 'Password restore request'
          this.isReqSuccessful = true;
        } else {
          this.errorMessageOfProcess = data.description;
        }
        this.subscription_reqRestorePass.unsubscribe();
        this.setLocked(false);
      }
    );
  }


  private get showErrorOfProcess(): boolean {

    const result = this.errorMessageOfProcess !== ''
      && this.groupAccountEmail.valid;

    if (!result) {
      this.errorMessageOfProcess = '';
    }
    return result;
  }

  private get showErrorOfCaptcha(): boolean {

    const result = this.errorMessageOfCaptcha !== '';

    if (!result) {
      this.errorMessageOfCaptcha = '';
    }
    return result;
  }
}
