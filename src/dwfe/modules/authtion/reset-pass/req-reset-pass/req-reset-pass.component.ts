import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {of} from 'rxjs';
import {concatMap, delay, takeUntil} from 'rxjs/operators';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';
import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

import {AuthtionExchangeService} from '../../services/authtion-exchange.service';

@Component({
  selector: 'app-authtion-req-reset-pass',
  templateUrl: './req-reset-pass.component.html'
})
export class AuthtionReqResetPassComponent extends AbstractExchangeableDwfe implements AfterViewInit, OnDestroy {

  private groupAccountEmail = new FormGroup({});
  private controlAccountEmail: AbstractControl;
  @ViewChild('refAccountEmail', {read: ElementRef}) private refAccountEmail: ElementRef;
  private isReqSuccessful = false;

  constructor(private exchangeService: AuthtionExchangeService,
              private dialogRef: MatDialogRef<AuthtionReqResetPassComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private router: Router) {
    super();
  }

  ngAfterViewInit(): void {
    this.isCaptchaValid$.pipe(
      takeUntil(this.latchForUnsubscribe),
      concatMap(x => of(x).pipe(delay(20))) // otherwise below this.groupCreateAccountEmail.get('email') return undefined
    ).subscribe(isCaptchaValid => {
      if (isCaptchaValid) {
        this.controlAccountEmail = this.groupAccountEmail.get('email');
        this.controlAccountEmail.setValue(this.data.email);
        this.resetBackendError('controlAccountEmail', ['errorMessage'], this.latchForUnsubscribe);
        UtilsDwfe.focusOnDwfeInput(this.refAccountEmail);
      }
    });

    this.dialogRef.afterClosed().subscribe(() => this.router.navigate(['/']));
  }

  setLocked(value: boolean): void {
    super.setLocked(value);
    if (!value && this.refAccountEmail) {
      UtilsDwfe.focusOnDwfeInput(this.refAccountEmail);
    }
  }

  private performReqResetPass(): void {
    this.exchangeService.reqResetPassExchanger
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
