import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';

import {Subject, Subscription} from 'rxjs';

import {AuthtionService} from '../services/authtion.service';
import {AuthtionExchangeService, CreateAccountExchange, GoogleCaptchaInitiator} from '../services/authtion-exchange.service';
import {AuthtionPageReqRestorePassComponent} from '../page-req-restore-pass/page-req-restore-pass.component';
import {UtilsDwfeService} from '@dwfe/services/utils.service';
import {ResultWithDescription} from '@dwfe/modules/authtion/services/authtion-exchange.service';

@Component({
  selector: 'app-authtion-page-login-register',
  templateUrl: './page-login-register.component.html',
  styleUrls: ['./page-login-register.component.scss']
})
export class AuthtionPageLoginRegisterComponent implements AfterViewInit, OnDestroy, GoogleCaptchaInitiator {

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
  private errorMessage = '';

  private isCreateAccountCaptchaValid = false;

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

    this.resetBackendError('controlLoginEmail', ['errorMessage'], this.latchForUnsubscribe);
    this.resetBackendError('controlLoginPassword', ['errorMessage'], this.latchForUnsubscribe);
    this.resetBackendError('controlCreateAccountEmail', ['errorMessage'], this.latchForUnsubscribe);
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

    this.errorMessage = '';
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

  public setErrorMessage(value: string): void {
    this.errorMessage = value;
  }

  public setCaptchaValid(value: boolean): void {
    this.isCreateAccountCaptchaValid = value;
  }

  private performLogin(): void {

    this.errorMessage = '';  // init

    // waiting for response
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
          this.errorMessage = data.description;
        }
      }
    );
  }

  private performCreateAccount(): void {

    CreateAccountExchange.of(this.exchangeService)
      .run(
        this,
        {
          email: this.controlCreateAccountEmail.value
        },
        (data: ResultWithDescription) => {
          if (data.result) { // actions on success 'Create account'
            this.changeSlide(); // just go to 'Login' slide
          } else {
            this.errorMessage = data.description;
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








