import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';

import {Subject} from 'rxjs';

import {
  AuthtionExchangeService,
  ExchangeInitiator,
  GoogleCaptchaProcess,
  ReqRestorePassExchanger
} from '@dwfe/modules/authtion/services/authtion-exchange.service';
import {UtilsDwfeService} from '@dwfe/services/utils.service';

@Component({
  selector: 'app-authtion-page-req-restore-pass',
  templateUrl: './page-req-restore-pass.component.html'
})
export class AuthtionPageReqRestorePassComponent implements AfterViewInit, OnDestroy, GoogleCaptchaProcess, ExchangeInitiator {

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

  constructor(public exchangeService: AuthtionExchangeService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngAfterViewInit(): void {
    this.controlAccountEmail = this.groupAccountEmail.get('email');
    setTimeout(() => this.controlAccountEmail.setValue(this.data.email), 10);

    UtilsDwfeService.resetBackendError.bind(this, 'controlAccountEmail', ['errorMessageOfProcess', 'errorMessageOfCaptcha'], this.latchForUnsubscribe);
  }

  ngOnDestroy(): void {
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

  public setErrorMessageOfExchange(value: string): void {
    this.errorMessageOfProcess = value;
  }

  private performReqRestorePass(): void {
    ReqRestorePassExchanger.of(this.exchangeService)
      .run(
        this,                                    // source
        {email: this.controlAccountEmail.value}, // params
        data => {                                // fnRequestHandlingLogic
          if (data.result) { // actions on success 'Password restore request'
            this.isReqSuccessful = true;
          } else {
            this.errorMessageOfProcess = data.description;
          }
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
