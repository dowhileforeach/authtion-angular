import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';

import {Subject} from 'rxjs';

import {AuthtionExchangeService, ReqRestorePassExchanger} from '@dwfe/modules/authtion/services/authtion-exchange.service';
import {UtilsDwfeService} from '@dwfe/services/utils.service';
import {AbstractExchangableDwfe} from '@dwfe/classes/AbstractExchangableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';

@Component({
  selector: 'app-authtion-page-req-restore-pass',
  templateUrl: './page-req-restore-pass.component.html'
})
export class AuthtionPageReqRestorePassComponent extends AbstractExchangableDwfe implements AfterViewInit, OnDestroy {

  private groupAccountEmail = new FormGroup({});
  private controlAccountEmail: AbstractControl;
  @ViewChild('refAccountEmail', {read: ElementRef}) private refAccountEmail: ElementRef;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  private isReqSuccessful = false;

  private latchForUnsubscribe = new Subject();

  constructor(public exchangeService: AuthtionExchangeService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
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

  private performReqRestorePass(): void {
    ReqRestorePassExchanger.of(this.exchangeService.http)
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
