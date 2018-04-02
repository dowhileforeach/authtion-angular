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
  emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  passwordMinLenght = 6;
  passwordMaxLenght = 55;

  ngOnInit(): void {

    this.formLogin = new FormGroup({
      'email': new FormControl('', [Validators.required, this.emailAddressValidator.bind(this)]),
      'password': new FormControl('', [Validators.required, this.passwordLenghtValidator.bind(this)])
    });

    this.formCreateAccount = new FormGroup({
      'email': new FormControl('', [Validators.required, this.emailAddressValidator.bind(this)])
    })
    ;
  }

  isEmpty(value): boolean {
    if (value) {
      return value.trim().length === 0;
    }
    return true;
  }

  changeSlide(translate) {
    this.isLoginSlideActive = translate === 1;
    this.isCreateAccountSlideActive = translate === 2;
  }

  emailAddressValidator(control: FormControl) {
    if (!this.emailregex.test(control.value)) {
      return {
        'isNotEmail': true
      };
    }
    return null;
  }

  passwordLenghtValidator(control: FormControl) {
    const password_lenght = control.value.length;
    if (password_lenght < this.passwordMinLenght || password_lenght > this.passwordMaxLenght) {
      return {
        'passwordLenght': true
      };
    }
    return null;
  }

  isControlWrong(form: FormGroup, controlName: string, errorName: string) {
    const control = form.get(controlName);
    if ((control.dirty || control.touched)
      && control.errors !== null
      && control.errors.hasOwnProperty(errorName)) {
      return control.errors[errorName];
    }
    return false;
  }
}
