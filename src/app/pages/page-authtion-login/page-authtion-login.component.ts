import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export interface FormModel {
  captcha?: string;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './page-authtion-login.component.html',
  styleUrls: ['./page-authtion-login.component.scss']
})
export class PageAuthtionLoginComponent implements OnInit {

  email = '';
  password = '';
  isLoginSlideActive = true;
  isCreateAccountSlideActive = false;

  formLogin: FormGroup;
  formCreateAccount: FormGroup;

  // http://emailregex.com/
  EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  emailMaxLength = 50;
  passwordMinLength = 6;
  passwordMaxLength = 55;

  ngOnInit(): void {

    this.formLogin = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        this.emailRegexpValidator.bind(this),
        this.emailLengthValidator.bind(this),
      ]),
      'password': new FormControl('', [
        Validators.required,
        this.passwordLengthValidator.bind(this),
      ])
    });

    this.formCreateAccount = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        this.emailRegexpValidator.bind(this),
        this.emailLengthValidator.bind(this),
      ])
    });
  }

  changeSlide(translate) {
    this.isLoginSlideActive = translate === 1;
    this.isCreateAccountSlideActive = translate === 2;
  }

  isEmpty(value): boolean {
    if (value) {
      return value.trim().length === 0;
    }
    return true;
  }

  isWrong(form: FormGroup, controlName: string, errorName: string) {
    const control = form.get(controlName);
    if ((control.dirty || control.touched)
      && control.errors !== null
      && control.errors.hasOwnProperty(errorName)) {
      return control.errors[errorName];
    }
    return false;
  }

  emailRegexpValidator(control: FormControl) {
    if (!this.EMAIL_PATTERN.test(control.value)) {
      return {
        'isNotEmail': true
      };
    }
    return null;
  }

  emailLengthValidator(control: FormControl) {
    const emailLength = control.value.length;
    if (emailLength > this.emailMaxLength) {
      return {
        'emailLength': true
      };
    }
    return null;
  }

  passwordLengthValidator(control: FormControl) {
    const passwordLength = control.value.length;
    if (passwordLength < this.passwordMinLength || passwordLength > this.passwordMaxLength) {
      return {
        'passwordLength': true
      };
    }
    return null;
  }
}
