import {Component} from '@angular/core';

@Component({
  selector: 'app-logon-page',
  templateUrl: './page-logon.component.html',
  styleUrls: ['./page-logon.component.scss']
})
export class PageLogonComponent {

  email = '';
  password = '';
  isLogin = true;
  isCreateAccount = false;

  trimmedStrIsEmpty(value): boolean {
    let result = true;
    if (value) {
      result = value.trim().length === 0;
    }
    return result;
  }

  changeSlide(translate) {
    this.isLogin = translate === 1;
    this.isCreateAccount = translate === 2;
  }
}
