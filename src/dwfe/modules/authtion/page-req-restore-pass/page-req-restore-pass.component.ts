import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';

import {Subject, Subscription} from 'rxjs';

import {AuthtionExchangeService, GoogleCaptchaProcess} from '@dwfe/modules/authtion/services/authtion-exchange.service';
import {UtilsDwfeService} from '@dwfe/services/utils.service';

@Component({
  selector: 'app-authtion-page-req-restore-pass',
  templateUrl: './page-req-restore-pass.component.html'
})
export class AuthtionPageReqRestorePassComponent implements AfterViewInit, OnDestroy, GoogleCaptchaProcess {

  private isReqSuccessful = false;

  private groupAccountEmail = new FormGroup({});
  private controlAccountEmail: AbstractControl;
  @ViewChild('refAccountEmail', {read: ElementRef}) private refAccountEmail: ElementRef;

  private isLocked = false;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  private errorMessageOfProcess = '';

  private isCaptchaValid = false;
  private errorMessageOfCaptcha = '';

  private latchForUnsubscribe = new Subject();
  private subscription_reqRestorePass: Subscription;

  constructor(public exchangeService: AuthtionExchangeService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngAfterViewInit(): void {
    this.controlAccountEmail = this.groupAccountEmail.get('email');
    setTimeout(() => this.controlAccountEmail.setValue(this.data.email), 10);

    UtilsDwfeService.resetBackendError.bind(this, 'controlAccountEmail', ['errorMessageOfProcess', 'errorMessageOfCaptcha'], this.latchForUnsubscribe);
  }

  ngOnDestroy(): void {
    if (this.subscription_reqRestorePass) {
      this.subscription_reqRestorePass.unsubscribe();
    }
    this.latchForUnsubscribe.next();
  }

  public setLocked(value: boolean): void {

    this.isLocked = value;

    if (value) {
      this.refPendingOverlayWrap.nativeElement.focus();
    } else {
      UtilsDwfeService.focusOnDwfeInput(this.refAccountEmail);
    }
  }

  public setErrorMessageOfCaptcha(value: string): void {
    this.errorMessageOfCaptcha = value;
  }

  public setCaptchaValid(value: boolean): void {
    this.isCaptchaValid = value;
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
