import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-page-authtion-login-register',
  templateUrl: './page-authtion__login-register.component.html',
  styleUrls: ['./page-authtion__login-register.component.scss']
})
export class PageAuthtionLoginRegisterComponent {

  isLoginSlideActive = true;
  isCreateAccountSlideActive = false;

  gLoginEmail = new FormGroup({});
  gLoginPassword = new FormGroup({});
  gCreateAccountEmail = new FormGroup({});

  changeSlide(translate) {
    this.isLoginSlideActive = translate === 1;
    this.isCreateAccountSlideActive = translate === 2;
  }
}








