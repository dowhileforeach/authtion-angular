import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';

import {Subject} from 'rxjs';

import {
  AuthtionExchangeService,
  GoogleCaptchaInitiator,
  ReqRestorePassExchanger,
  ResultWithDescription
} from '@dwfe/modules/authtion/services/authtion-exchange.service';
import {UtilsDwfeService} from '@dwfe/services/utils.service';

@Component({
  selector: 'app-authtion-page-req-restore-pass',
  templateUrl: './page-req-restore-pass.component.html'
})
export class AuthtionPageReqRestorePassComponent implements AfterViewInit, OnDestroy, GoogleCaptchaInitiator {
  private groupAccountEmail = new FormGroup({});
  private controlAccountEmail: AbstractControl;
  @ViewChild('refAccountEmail', {read: ElementRef}) private refAccountEmail: ElementRef;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  private isReqSuccessful = false;

  private isLocked = false;
  private errorMessage = '';
  private isCaptchaValid = false;

  private latchForUnsubscribe = new Subject();

  constructor(public exchangeService: AuthtionExchangeService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngAfterViewInit(): void {
    this.controlAccountEmail = this.groupAccountEmail.get('email');
    setTimeout(() => this.controlAccountEmail.setValue(this.data.email), 10);
    UtilsDwfeService.resetBackendError.bind(this, 'controlAccountEmail', ['errorMessage'], this.latchForUnsubscribe);
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

  public setErrorMessage(value: string): void {
    this.errorMessage = value;
  }

  public setCaptchaValid(value: boolean): void {
    this.isCaptchaValid = value;
  }

  private performReqRestorePass(): void {
    ReqRestorePassExchanger.of(this.exchangeService)
      .run(
        this,                                    // initiator
        {                                        // request params
          email: this.controlAccountEmail.value
        },
        (data: ResultWithDescription) => {       // response handler
          if (data.result) { // actions on success 'Password restore request'
            this.isReqSuccessful = true;
          } else {
            this.errorMessage = data.description;
          }
        });
  }
}
