import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';
import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';
import {AuthtionExchangeService, ReqResetPassExchanger} from '@dwfe/modules/authtion/services/authtion-exchange.service';
import {concatMap, delay, takeUntil} from 'rxjs/operators';
import {of} from 'rxjs/index';

@Component({
  selector: 'app-authtion-page-req-reset-pass',
  templateUrl: './page-req-reset-pass.component.html'
})
export class AuthtionPageReqResetPassComponent extends AbstractExchangeableDwfe implements AfterViewInit, OnDestroy {

  private groupAccountEmail = new FormGroup({});
  private controlAccountEmail: AbstractControl;
  @ViewChild('refAccountEmail', {read: ElementRef}) private refAccountEmail: ElementRef;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  private isReqSuccessful = false;

  constructor(protected exchangeService: AuthtionExchangeService,
              @Inject(MAT_DIALOG_DATA) protected data: any) {
    super();
  }

  ngAfterViewInit(): void {
    this.isCaptchaValid$.pipe(
      takeUntil(this.latchForUnsubscribe.asObservable()),
      concatMap(x => of(x).pipe(delay(20))) // otherwise below this.groupCreateAccountEmail.get('email') return undefined
    ).subscribe(isCaptchaValid => {
      if (isCaptchaValid) {
        this.controlAccountEmail = this.groupAccountEmail.get('email');
        this.controlAccountEmail.setValue(this.data.email);
        this.resetBackendError('controlAccountEmail', ['errorMessage'], this.latchForUnsubscribe.asObservable());
        UtilsDwfe.focusOnDwfeInput(this.refAccountEmail);
      }
    });
  }

  public setLocked(value: boolean): void {
    super.setLocked(value);
    if (value) {
      this.refPendingOverlayWrap.nativeElement.focus();
    } else if (this.refAccountEmail) {
      UtilsDwfe.focusOnDwfeInput(this.refAccountEmail);
    }
  }

  private performReqResetPass(): void {
    ReqResetPassExchanger.of(this.exchangeService.http)
      .run(this,
        `{ "email": "${this.controlAccountEmail.value}" }`,
        (data: ResultWithDescription) => { // response handler
          if (data.result) { // actions on success 'Password reset request'
            this.isReqSuccessful = true;
          } else {
            this.errorMessage = data.description;
          }
        });
  }
}
