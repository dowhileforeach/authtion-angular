import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';

import {Subject, Subscription} from 'rxjs';

import {AuthtionService} from '../services/authtion.service';
import {AuthtionExchangeService, CreateAccountExchange, GoogleCaptchaProcess} from '../services/authtion-exchange.service';
import {AuthtionPageReqRestorePassComponent} from '../page-req-restore-pass/page-req-restore-pass.component';
import {UtilsDwfeService} from '@dwfe/services/utils.service';

@Component({
  selector: 'app-authtion-page-login-register',
  templateUrl: './page-login-register.component.html',
  styleUrls: ['./page-login-register.component.scss']
})
export class AuthtionPageLoginRegisterComponent implements AfterViewInit, OnDestroy, GoogleCaptchaProcess {

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

  private latchForUnsubscribe = new Subject();
  private subscription_signIn: Subscription;
  private subscription_createAccount: Subscription;

  private isLocked = false;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  private errorMessageOfProcessLogin = '';
  private errorMessageOfProcessCreateAccount = '';

  private isCreateAccountCaptchaValid = false;
  private errorMessageOfCreateAccountCaptcha = '';

  private resetBackendError = UtilsDwfeService.resetBackendError;
  private focusOnDwfeInput = UtilsDwfeService.focusOnDwfeInput;

  constructor(private authtionService: AuthtionService,
              public exchangeService: AuthtionExchangeService,
              private dialogRef: MatDialogRef<AuthtionPageLoginRegisterComponent>,
              private dialog: MatDialog) {
  }

  ngAfterViewInit(): void {
    this.controlLoginEmail = this.groupLoginEmail.get('email');
    this.controlLoginPassword = this.groupLoginPassword.get('password');
    this.controlCreateAccountEmail = this.groupCreateAccountEmail.get('email');

    this.focusOnDwfeInput(this.refLoginEmail);

    this.resetBackendError('controlLoginEmail', ['errorMessageOfProcessLogin'], this.latchForUnsubscribe);
    this.resetBackendError('controlLoginPassword', ['errorMessageOfProcessLogin'], this.latchForUnsubscribe);
    this.resetBackendError('controlCreateAccountEmail', ['errorMessageOfProcessCreateAccount', 'errorMessageOfCreateAccountCaptcha'], this.latchForUnsubscribe);
  }

  ngOnDestroy(): void {
    if (this.subscription_signIn) {
      this.subscription_signIn.unsubscribe();
    }
    if (this.subscription_createAccount) {
      this.subscription_createAccount.unsubscribe();
    }
    this.latchForUnsubscribe.next();
  }

  private changeSlide(): void {
    this.isLoginSlide = !this.isLoginSlide;
    this.afterChangeSlideActions();
  }

  private afterChangeSlideActions() {

    this.isCreateAccountCaptchaValid = this.isLoginSlide;

    this.exchangeEmail();

    setTimeout(() => this.focusOnInput()
      , 210 // becouse: .slider__inner {... transition: transform 200ms ...}
    );
  }

  private exchangeEmail(): void {
    this.isLoginSlide ?
      this.controlLoginEmail.setValue(this.controlCreateAccountEmail.value)
      : this.controlCreateAccountEmail.setValue(this.controlLoginEmail.value);
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

    this.isLocked = value;

    if (value) {
      this.refPendingOverlayWrap.nativeElement.focus();
    } else {
      this.focusOnInput();
    }
  }

  public setErrorMessageOfCaptcha(value: string): void {
    this.errorMessageOfCreateAccountCaptcha = value;
  }

  public setCaptchaValid(value: boolean): void {
    this.isCreateAccountCaptchaValid = value;
  }

  private get showErrorOfProcessLogin(): boolean {

    if (!this.isLoginSlide) {
      return false;
    }

    const result = this.errorMessageOfProcessLogin !== ''
      && this.groupLoginEmail.valid
      && this.groupLoginPassword.valid;

    if (!result) {
      this.errorMessageOfProcessLogin = '';
    }
    return result;
  }

  private get showErrorOfProcessCreateAccount(): boolean {

    if (this.isLoginSlide) {
      return false;
    }

    const result = this.errorMessageOfProcessCreateAccount !== ''
      && this.groupCreateAccountEmail.valid;

    if (!result) {
      this.errorMessageOfProcessCreateAccount = '';
    }
    return result;
  }

  private get showErrorOfCreateAccountCaptcha(): boolean {

    if (this.isLoginSlide) {
      return false;
    }

    const result = this.errorMessageOfCreateAccountCaptcha !== '';

    if (!result) {
      this.errorMessageOfCreateAccountCaptcha = '';
    }
    return result;
  }

  private performLogin(): void {

    this.errorMessageOfProcessLogin = '';  // init

    // waiting for service response
    this.setLocked(true);

    // signIn performs authtion-service, give it a login/password
    this.authtionService.performSignIn(this.controlLoginEmail.value, this.controlLoginPassword.value);

    // process service response
    this.subscription_signIn = this.authtionService.perform__signIn.subscribe(
      data => {
        if (data.result) { // actions on success 'Login'
          this.dialogRef.close();
        } else {
          this.subscription_signIn.unsubscribe(); // otherwise, the subscriptions will be as much as times the button is pressed
          this.setLocked(false);
          this.errorMessageOfProcessLogin = data.description;
        }
      }
    );
  }

  private performCreateAccount(): void {

    this.errorMessageOfProcessCreateAccount = ''; // init

    // waiting for service response
    this.setLocked(true);

    CreateAccountExchange.of(this.exchangeService)
      .performRequest({email: this.controlCreateAccountEmail.value})
      .result$.subscribe(
      data => {
        if (data.result) { // actions on success 'Create account'
          this.changeSlide(); // just go to 'Login' slide
        } else {
          this.errorMessageOfProcessCreateAccount = data.description;
        }
        this.setLocked(false);
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








