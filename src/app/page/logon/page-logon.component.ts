import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';

export interface FormModel {
  captcha?: string;
}

@Component({
  selector: 'app-logon-page',
  templateUrl: './page-logon.component.html',
  styleUrls: ['./page-logon.component.scss']
})
export class PageLogonComponent {

  public formModel: FormModel = {};

  email = '';
  password = '';
  isLoginSlideActive = true;
  isCreateAccountSlideActive = false;

  isEmpty(value): boolean {
    let result = true;
    if (value) {
      result = value.trim().length === 0;
    }
    return result;
  }

  changeSlide(translate) {
    this.isLoginSlideActive = translate === 1;
    this.isCreateAccountSlideActive = translate === 2;
  }

}
