import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

import {AuthtionService} from '../../authtion.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-page-authtion-login-register',
  templateUrl: './page-authtion__login-register.component.html',
  styleUrls: ['./page-authtion__login-register.component.scss']
})
export class PageAuthtionLoginRegisterComponent implements AfterViewInit, OnDestroy {

  isLoginSlide = true;

  groupLoginEmail = new FormGroup({});
  groupLoginPassword = new FormGroup({});
  groupCreateAccountEmail = new FormGroup({});

  controlLoginEmail: AbstractControl;
  controlLoginPassword: AbstractControl;
  controlCreateAccountEmail: AbstractControl;

  @ViewChild('refLoginEmail', {read: ElementRef}) refLoginEmail: ElementRef;
  @ViewChild('refLoginPassword', {read: ElementRef}) refLoginPassword: ElementRef;
  @ViewChild('refCreateAccountEmail', {read: ElementRef}) refCreateAccountEmail: ElementRef;

  subscriptionToResultOfPerformLogin: Subscription;

  constructor(private authtionService: AuthtionService) {
  }

  ngAfterViewInit(): void {
    this.controlLoginEmail = this.groupLoginEmail.get('email');
    this.controlLoginPassword = this.groupLoginPassword.get('password');
    this.controlCreateAccountEmail = this.groupCreateAccountEmail.get('email');

    this.performFocus(this.refLoginEmail);
  }

  changeSlide() {
    this.isLoginSlide = !this.isLoginSlide;
    this.afterChangeSlideActions();
  }

  afterChangeSlideActions() {

    this.exchangeEmail();

    setTimeout(() => this.setFocusedField()
      , 210 // becouse: .slider__inner {... transition: transform 200ms ease; ...}
    );
  }

  exchangeEmail() {
    this.isLoginSlide ?
      this.controlLoginEmail.setValue(this.controlCreateAccountEmail.value)
      : this.controlCreateAccountEmail.setValue(this.controlLoginEmail.value);
  }

  setFocusedField() {
    if (this.isLoginSlide) {
      if (this.controlLoginEmail.invalid) {
        this.performFocus(this.refLoginEmail);
      } else if (this.controlLoginPassword.invalid) {
        this.performFocus(this.refLoginPassword);
      }
    } else {
      if (this.controlCreateAccountEmail.invalid) {
        this.performFocus(this.refCreateAccountEmail);
      }
    }
  }

  performFocus(elementRef: ElementRef) {
    elementRef.nativeElement.querySelector('.form-group-authtion input').focus();
  }

  performLogin() {
    // отдать логин/пароль authtion-сервису
    this.authtionService.performLogin(this.controlLoginEmail.value, this.controlLoginPassword.value);

    // ждать ответа сервиса
    // - верхние контролы становятся недоступными
    // - вся форма Login становится недоступной
    // - спиннер

    // обработать ответ сервиса
    this.subscriptionToResultOfPerformLogin = this.authtionService.resultOfPerformLogin().subscribe(result => {
        if (result.value) {
          // действия в случае успешного логина
          // - закрыть диалог
          console.log(`page--success Login=${result.reasonOfFailure}`);
        } else {
          // действия в случае неудачного логина
          // - разблокировать верхние контролы и форму Login, выключить спиннер
          console.log(`page--failed Login=${result.reasonOfFailure}`);
        }
        this.subscriptionToResultOfPerformLogin.unsubscribe(); // Important. Otherwise, the subscriptions will be as much as times the button is pressed
      }
    );
  }

  performCreateAccount() {

  }

  ngOnDestroy(): void {
    this.subscriptionToResultOfPerformLogin.unsubscribe();
  }
}








