import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './page-authtion-login.component.html',
  styleUrls: ['./page-authtion-login.component.scss']
})
export class PageAuthtionLoginComponent {

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








