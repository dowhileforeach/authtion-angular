import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AuthtionService} from '../services/authtion.service';
import {AuthtionExchangeService, CreateAccountExchanger} from '../services/authtion-exchange.service';
import {AuthtionPageReqRestorePassComponent} from '../page-req-restore-pass/page-req-restore-pass.component';
import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';
import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

@Component({
  selector: 'app-authtion-page-login-register',
  templateUrl: './page-login-register.component.html',
  styleUrls: ['./page-login-register.component.scss']
})
export class AuthtionPageLoginRegisterComponent extends AbstractExchangeableDwfe implements AfterViewInit, OnDestroy {

  private isLoginSlide = true;

  private groupLoginEmail = new FormGroup({});
  private groupLoginPassword = new FormGroup({});
  private groupCreateAccountEmail = new FormGroup({});
  private controlLoginEmail: AbstractControl;
  private controlLoginPassword: AbstractControl;
  private controlCreateAccountEmail: AbstractControl;

  @ViewChild('refLoginEmail', {read: ElementRef}) private refLoginEmail: ElementRef;
  @ViewChild('refLoginPassword', {read: ElementRef}) private refLoginPassword: ElementRef;
  @ViewChild('refCreateAccountEmail', {read: ElementRef}) private refCreateAccountEmail: ElementRef;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;

  private latchForUnsubscribe = new Subject();

  private resetBackendError = UtilsDwfe.resetBackendError;
  private focusOnDwfeInput = UtilsDwfe.focusOnDwfeInput;

  constructor(protected authtionService: AuthtionService,
              protected exchangeService: AuthtionExchangeService,
              protected dialogRef: MatDialogRef<AuthtionPageLoginRegisterComponent>,
              protected dialog: MatDialog) {
    super();
  }

  ngAfterViewInit(): void {
    this.controlLoginEmail = this.groupLoginEmail.get('email');
    this.controlLoginPassword = this.groupLoginPassword.get('password');
    this.controlCreateAccountEmail = this.groupCreateAccountEmail.get('email');

    this.focusOnDwfeInput(this.refLoginEmail);

    this.resetBackendError('controlLoginEmail', ['errorMessage'], this.latchForUnsubscribe.asObservable());
    this.resetBackendError('controlLoginPassword', ['errorMessage'], this.latchForUnsubscribe.asObservable());
    this.resetBackendError('controlCreateAccountEmail', ['errorMessage'], this.latchForUnsubscribe.asObservable());
  }

  ngOnDestroy(): void {
    this.latchForUnsubscribe.next();
  }

  private changeSlide(): void {
    this.isLoginSlide = !this.isLoginSlide;
    this.errorMessage = '';
    this.isCaptchaValid = false;

    this.isLoginSlide ?
      this.controlLoginEmail.setValue(this.controlCreateAccountEmail.value)
      : this.controlCreateAccountEmail.setValue(this.controlLoginEmail.value);

    setTimeout(() => this.focusOnInput()
      , 210 // becouse: .slider__inner {... transition: transform 200ms ...}
    );
  }

  private focusOnInput(): void {
    if (this.isLoginSlide) {
      if (this.controlLoginEmail.invalid) {
        this.focusOnDwfeInput(this.refLoginEmail);
      } else if (this.controlLoginPassword.invalid) {
        this.focusOnDwfeInput(this.refLoginPassword);
      } else {
        this.focusOnDwfeInput(this.refLoginEmail);
      }
    } else {
      this.focusOnDwfeInput(this.refCreateAccountEmail);
    }
  }

  public setLocked(value: boolean): void {
    super.setLocked(value);
    if (value) {
      this.refPendingOverlayWrap.nativeElement.focus();
    } else {
      this.focusOnInput();
    }
  }

  private performLogin(): void {

    this.errorMessage = '';
    this.setLocked(true);

    this.authtionService
      .performSignIn(this.controlLoginEmail.value, this.controlLoginPassword.value)
      .resultSignIn$
      .pipe(takeUntil(this.getIsLocked$()))
      .subscribe(
        (data: ResultWithDescription) => {
          if (data.result) { // actions on success 'Login'
            this.dialogRef.close();
          } else {
            this.errorMessage = data.description;
          }
          this.setLocked(false);
        }
      );
  }

  private performCreateAccount(): void {

    CreateAccountExchanger.of(this.exchangeService.http)
      .run(this,
        {
          email: this.controlCreateAccountEmail.value
        },
        (data: ResultWithDescription) => {
          if (data.result) {    // actions on success 'Create account'
            this.changeSlide(); // just go to 'Login' slide
          } else {
            this.errorMessage = data.description;
          }
        }
      );
  }

  private openReqRestorePasswordDialog(): void {
    this.dialogRef.close();
    this.dialog.open( // https://material.angular.io/components/dialog/api
      AuthtionPageReqRestorePassComponent, {
        autoFocus: true,
        data: {email: this.controlLoginEmail.value}
      });
  }
}








