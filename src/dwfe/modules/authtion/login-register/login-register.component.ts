import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {of} from 'rxjs';
import {concatMap, delay, takeUntil} from 'rxjs/operators';

import {AuthtionService} from '../services/authtion.service';
import {AuthtionExchangeService, CreateAccountExchanger} from '../services/authtion-exchange.service';
import {AuthtionReqResetPassComponent} from '../reset-pass/req-reset-pass/req-reset-pass.component';
import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authtion-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class AuthtionLoginRegisterComponent extends AbstractExchangeableDwfe implements AfterViewInit, OnDestroy {

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

  private isLoggedIn = false;

  constructor(protected authtionService: AuthtionService,
              protected exchangeService: AuthtionExchangeService,
              protected dialogRef: MatDialogRef<AuthtionLoginRegisterComponent>,
              protected dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) protected data: any,
              protected router: Router) {
    super();
  }

  ngAfterViewInit(): void {
    this.controlLoginEmail = this.groupLoginEmail.get('email');
    this.controlLoginPassword = this.groupLoginPassword.get('password');

    setTimeout(() => {
      if (this.data.email) {
        this.controlLoginEmail.setValue(this.data.email);
        this.focusOnDwfeInput(this.refLoginPassword);
      } else {
        this.focusOnDwfeInput(this.refLoginEmail);
      }
    }, 10); // to prevent ExpressionChangedAfterItHasBeenCheckedError

    this.resetBackendError('controlLoginEmail', ['errorMessage'], this.latchForUnsubscribe);
    this.resetBackendError('controlLoginPassword', ['errorMessage'], this.latchForUnsubscribe);

    this.isCaptchaValid$.pipe(
      takeUntil(this.latchForUnsubscribe),
      concatMap(x => of(x).pipe(delay(20))) // otherwise below this.groupCreateAccountEmail.get('email') return undefined
    ).subscribe(isCaptchaValid => {
      if (isCaptchaValid) {
        this.controlCreateAccountEmail = this.groupCreateAccountEmail.get('email');
        this.controlCreateAccountEmail.setValue(this.controlLoginEmail.value);
        this.resetBackendError('controlCreateAccountEmail', ['errorMessage'], this.latchForUnsubscribe);
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
        if (this.isLoginSlide && this.controlCreateAccountEmail) {
          this.controlLoginEmail.setValue(this.controlCreateAccountEmail.value);
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
      if (this.controlLoginEmail.invalid) {
        this.focusOnDwfeInput(this.refLoginEmail);
      } else if (this.controlLoginPassword.invalid) {
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

    CreateAccountExchanger.of(this.exchangeService.http)
      .run(this,
        `{ "email": "${this.controlCreateAccountEmail.value}" }`,
        (data: ResultWithDescription) => {
          if (data.result) {    // actions on success 'Create account'
            this.changeSlide(); // go to 'Login' slide
            this.controlLoginPassword.setValue('');
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
        data: {email: this.controlLoginEmail.value}
      });
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-authtion-login-register-wrap',
  template: ``,
})
export class AuthtionLoginRegisterWrapComponent implements OnInit {

  constructor(protected dialog: MatDialog) {
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





