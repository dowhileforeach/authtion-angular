import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

import {Subscription} from 'rxjs/Subscription';

import {AuthtionService} from '../services/authtion.service';

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

  private isLocked = false;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  private errorMessageOfProcessLogin = '';
  private errorMessageOfProcessCreateAccount = '';

  constructor(private authtionService: AuthtionService,
              private dialogRef: MatDialogRef<AuthtionPageLoginRegisterComponent>) {
  }

  ngAfterViewInit(): void {
    this.controlLoginEmail = this.groupLoginEmail.get('email');
    this.controlLoginPassword = this.groupLoginPassword.get('password');
    this.controlCreateAccountEmail = this.groupCreateAccountEmail.get('email');

    this.focusOnAuthtionInput(this.refLoginEmail);
  }

  ngOnDestroy(): void {
    if (this.subscriptionToResultOfPerformLogin) {
      this.subscriptionToResultOfPerformLogin.unsubscribe();
    }
  }

  private changeSlide() {
    this.isLoginSlide = !this.isLoginSlide;
    this.afterChangeSlideActions();
  }

  private afterChangeSlideActions() {

    this.exchangeEmail();

    setTimeout(() => this.focusOnInput()
      , 210 // becouse: .slider__inner {... transition: transform 200ms ease; ...}
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
        this.focusOnAuthtionInput(this.refLoginEmail);
      } else if (this.controlLoginPassword.invalid) {
        this.focusOnAuthtionInput(this.refLoginPassword);
      }
    } else {
      if (this.controlCreateAccountEmail.invalid) {
        this.focusOnAuthtionInput(this.refCreateAccountEmail);
      }
    }
  }

  private focusOnAuthtionInput(elementRef: ElementRef) {
    elementRef.nativeElement.querySelector('.form-group-authtion input').focus();
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

    // signIn performs authtion-service, give it a login/password
    this.authtionService.performLogin(this.controlLoginEmail.value, this.controlLoginPassword.value);

    // wait for service response
    this.setLocked(true);

    // process service response
    this.subscriptionToResultOfPerformLogin = this.authtionService.getResultOfPerformLogin().subscribe(result => {
        if (result.value) { // actions on success Login
          this.dialogRef.close();
        } else {
          this.setLocked(false);
          this.errorMessageOfProcessLogin = result.reasonOfFailure;
        }
        this.subscriptionToResultOfPerformLogin.unsubscribe(); // Important. Otherwise, the subscriptions will be as much as times the button is pressed
      }
    );
  }

  private performCreateAccount() {

  }

  private get showErrorOfProcessLogin(): boolean {

    if (!this.isLoginSlide) {
      return false;
    }

    const result = !(this.errorMessageOfProcessLogin === '')
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

    const result = !(this.errorMessageOfProcessCreateAccount === '')
      && this.groupCreateAccountEmail.valid;

    if (!result) {
      this.errorMessageOfProcessCreateAccount = '';
    }
    return result;
  }
}








