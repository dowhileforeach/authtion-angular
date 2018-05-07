import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

import {Subscription} from 'rxjs/Subscription';

import {AuthtionService} from '../services/authtion.service';
import {AuthtionExchangeService} from '../services/authtion-exchange.service';
import {UtilsDwfeService} from '@dwfe/services/utils.service';

@Component({
  selector: 'app-authtion-page-login-register',
  templateUrl: './page-login-register.component.html',
  styleUrls: ['./page-login-register.component.scss']
})
export class AuthtionPageLoginRegisterComponent implements AfterViewInit, OnDestroy {

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

  private subscriptionToResultOfPerformLogin: Subscription;
  private emailChangesLoginResetBackendError: Subscription;
  private passwordChangesLoginResetBackendError: Subscription;
  private emailChangesCreateAccountResetBackendError: Subscription;

  private isLocked = false;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  private errorMessageOfProcessLogin = '';
  private errorMessageOfProcessCreateAccount = '';

  private isCreateAccountCaptchaValid = false;
  private errorMessageOfCreateAccountCaptcha = '';

  constructor(private authtionService: AuthtionService,
              public exchangeService: AuthtionExchangeService,
              private dialogRef: MatDialogRef<AuthtionPageLoginRegisterComponent>) {
  }

  ngAfterViewInit(): void {
    this.controlLoginEmail = this.groupLoginEmail.get('email');
    this.controlLoginPassword = this.groupLoginPassword.get('password');
    this.controlCreateAccountEmail = this.groupCreateAccountEmail.get('email');

    this.focusOnDwfeInput(this.refLoginEmail);

    this.emailChangesLoginResetBackendError = this.resetBackendError('controlLoginEmail', ['errorMessageOfProcessLogin']);
    this.passwordChangesLoginResetBackendError = this.resetBackendError('controlLoginPassword', ['errorMessageOfProcessLogin']);
    this.emailChangesCreateAccountResetBackendError = this.resetBackendError('controlCreateAccountEmail', ['errorMessageOfProcessCreateAccount', 'errorMessageOfCreateAccountCaptcha']);
  }

  ngOnDestroy(): void {
    if (this.subscriptionToResultOfPerformLogin) {
      this.subscriptionToResultOfPerformLogin.unsubscribe();
    }
    this.emailChangesLoginResetBackendError.unsubscribe();
    this.passwordChangesLoginResetBackendError.unsubscribe();
    this.emailChangesCreateAccountResetBackendError.unsubscribe();
  }

  private resetBackendError(controlFieldName, fieldsArr): Subscription {
    return this[controlFieldName].valueChanges.subscribe(() => {
      fieldsArr.forEach(errorFieldName => {
        if (this[errorFieldName] !== '') {
          this[errorFieldName] = '';
        }
      });
    });
  }

  private changeSlide() {
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

  private exchangeEmail() {
    this.isLoginSlide ?
      this.controlLoginEmail.setValue(this.controlCreateAccountEmail.value)
      : this.controlCreateAccountEmail.setValue(this.controlLoginEmail.value);
  }

  private focusOnInput() {
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

  private focusOnDwfeInput(elementRef: ElementRef) {
    elementRef.nativeElement.querySelector('.form-group-dwfe input').focus();
  }

  private setLocked(value: boolean): void {

    this.isLocked = value;

    if (value) {
      this.refPendingOverlayWrap.nativeElement.focus();
    } else {
      this.focusOnInput();
    }
  }

  private performLogin() {

    this.errorMessageOfProcessLogin = '';  // init

    // signIn performs authtion-service, give it a login/password
    this.authtionService.performLogin(this.controlLoginEmail.value, this.controlLoginPassword.value);

    // wait for service response
    this.setLocked(true);

    // process service response
    this.subscriptionToResultOfPerformLogin = this.authtionService.performLoginResult.subscribe(
      data => {
        if (data.result) { // actions on success Login
          this.dialogRef.close();
        } else {
          this.setLocked(false);
          this.errorMessageOfProcessLogin = data.description;
        }
        this.subscriptionToResultOfPerformLogin.unsubscribe(); // otherwise, the subscriptions will be as much as times the button is pressed
      }
    );
  }

  private performCreateAccount() {

    this.errorMessageOfProcessCreateAccount = ''; // init

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

  public googleCaptchaResolved(googleResponse: string): void {
    this.errorMessageOfCreateAccountCaptcha = ''; // init

    if (googleResponse === null) {
      this.isCreateAccountCaptchaValid = false;
      return;
    }

    this.isLocked = true;

    this.exchangeService.post_googleCaptchaValidate(googleResponse).subscribe(
      data => {
        if (data['success']) {
          this.isCreateAccountCaptchaValid = true;
        } else {
          this.errorMessageOfCreateAccountCaptcha = UtilsDwfeService.getReadableErrorFromDwfeServer(data);
        }
        this.isLocked = false;
      },
      error => {
        this.errorMessageOfCreateAccountCaptcha = UtilsDwfeService.getHttpError(error);
        this.isLocked = false;
      }
    );
  }
}








