import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl} from '@angular/forms';

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {of} from 'rxjs';
import {concatMap, delay, takeUntil} from 'rxjs/operators';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';

import {AuthtionService} from '../services/authtion.service';
import {AuthtionExchangeService} from '../services/authtion-exchange.service';
import {AuthtionReqResetPassComponent} from '../reset-pass/req-reset-pass/req-reset-pass.component';

@Component({
  selector: 'app-authtion-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class AuthtionLoginRegisterComponent extends AbstractExchangeableDwfe implements AfterViewInit {

  private isLoginSlide = true;

  private cLoginEmail: AbstractControl;
  private cLoginPassword: AbstractControl;
  private cCreateAccountEmail: AbstractControl;

  @ViewChild('refLoginEmail', {read: ElementRef}) private refLoginEmail: ElementRef;
  @ViewChild('refLoginPassword', {read: ElementRef}) private refLoginPassword: ElementRef;
  @ViewChild('refCreateAccountEmail', {read: ElementRef}) private refCreateAccountEmail: ElementRef;

  private isLoggedIn = false;

  constructor(private authtionService: AuthtionService,
              private exchangeService: AuthtionExchangeService,
              private dialogRef: MatDialogRef<AuthtionLoginRegisterComponent>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private router: Router) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.data.email) {
        this.cLoginEmail.setValue(this.data.email);
        this.focusOnDwfeInput(this.refLoginPassword);
      } else {
        this.focusOnDwfeInput(this.refLoginEmail);
      }
    }, 10); // to prevent ExpressionChangedAfterItHasBeenCheckedError

    this.resetBackendMessage('cLoginEmail', ['errorMessage'], this.latchForUnsubscribe);
    this.resetBackendMessage('cLoginPassword', ['errorMessage'], this.latchForUnsubscribe);

    this.isCaptchaValid$.pipe(
      takeUntil(this.latchForUnsubscribe),
      concatMap(x => of(x).pipe(delay(20))) // otherwise below this.cCreateAccountEmail return undefined
    ).subscribe(isCaptchaValid => {
      if (isCaptchaValid) {
        this.cCreateAccountEmail.setValue(this.cLoginEmail.value);
        this.resetBackendMessage('cCreateAccountEmail', ['errorMessage'], this.latchForUnsubscribe);
        this.focusOnInput();
      }
    });

    const redirectUrl = this.authtionService.redirectUrl;
    this.dialogRef.afterClosed().subscribe(() => {
      if (!(redirectUrl && this.isLoggedIn)) {
        this.router.navigate(['/']);
      }
    });
  }

  private changeSlide(): void {

    this.isLoginSlide = !this.isLoginSlide;
    this.errorMessage = '';

    setTimeout(() => {
        if (this.isLoginSlide && this.cCreateAccountEmail) {
          this.cLoginEmail.setValue(this.cCreateAccountEmail.value);
          this.focusOnInput();
        }
        this.subjIsCaptchaValid.next(false);
      }, 210 // becouse:
      // 1) .slider__inner {... transition: transform 200ms ...}
      // 2) this.subjIsCaptchaValid.next(false); require delay
    );
  }

  private focusOnInput(): void {
    if (this.isLoginSlide) {
      if (this.cLoginEmail.invalid) {
        this.focusOnDwfeInput(this.refLoginEmail);
      } else if (this.cLoginPassword.invalid) {
        this.focusOnDwfeInput(this.refLoginPassword);
      } else if (this.errorMessage !== '') {
        this.focusOnDwfeInput(this.refLoginPassword);
      } else {
        this.focusOnDwfeInput(this.refLoginEmail);
      }
    } else if (this.refCreateAccountEmail) {
      this.focusOnDwfeInput(this.refCreateAccountEmail);
    }
  }

  setLocked(value: boolean): void {
    super.setLocked(value);
    if (!value) {
      this.focusOnInput();
    }
  }

  private performLogin(): void {

    this.errorMessage = '';
    this.setLocked(true);

    this.authtionService
      .performSignIn(this.cLoginEmail.value, this.cLoginPassword.value)
      .resultSignIn$
      .pipe(takeUntil(this.isLocked$()))
      .subscribe(
        (data: ResultWithDescription) => {
          if (data.result) { // actions on success 'Login'
            this.isLoggedIn = true;
            this.dialogRef.close();
          } else {
            this.errorMessage = data.description;
          }
          this.setLocked(false);
        }
      );
  }

  private performCreateAccount(): void {

    this.exchangeService.createAccountExchanger
      .run(this,
        `{ "email": "${this.cCreateAccountEmail.value}" }`,
        (data: ResultWithDescription) => {
          if (data.result) {    // actions on success 'Create account'
            this.changeSlide(); // go to 'Login' slide
            this.cLoginPassword.setValue('');
          } else {
            this.errorMessage = data.description;
          }
        }
      );
  }

  private openReqResetPasswordDialog(): void {
    this.dialog.open( // https://material.angular.io/components/dialog/api
      AuthtionReqResetPassComponent, {
        autoFocus: true,
        data: {email: this.cLoginEmail.value}
      });
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-authtion-login-register-wrap',
  template: ``,
})
export class AuthtionLoginRegisterWrapComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dialog.open( // https://material.angular.io/components/dialog/api
        AuthtionLoginRegisterComponent, {
          autoFocus: false, // prevent autofocusing (default autofocus on field with attribute 'cdkFocusInitial')
          data: {}
        });
    }, 10);
  }
}
