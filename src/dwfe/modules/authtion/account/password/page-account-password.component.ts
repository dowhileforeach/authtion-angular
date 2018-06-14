import {AfterViewInit, Component} from '@angular/core';
import {AbstractControl} from '@angular/forms';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';

import {AuthtionExchangeService} from '../../services/authtion-exchange.service';

@Component({
  selector: 'app-authtion-account-password',
  templateUrl: './page-account-password.component.html',
  styleUrls: ['./page-account-password.component.scss'],
})
export class AuthtionAccountPasswordComponent extends AbstractExchangeableDwfe implements AfterViewInit {

  private cNewPassword: AbstractControl;
  private cRepeatNewPassword: AbstractControl;
  private cCurrentPassword: AbstractControl;

  constructor(private exchangeService: AuthtionExchangeService) {
    super();
  }

  ngAfterViewInit(): void {
    this.resetBackendMessage('cNewPassword', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    this.resetBackendMessage('cRepeatNewPassword', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    this.resetBackendMessage('cCurrentPassword', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
  }

  private performChangePassword(): void {
    if (this.cNewPassword.value !== this.cRepeatNewPassword.value) {
      this.errorMessage = 'New Password and Repeat do not match';
      return;
    }

    this.exchangeService.changePassExchanger
      .run(this,
        `{ "curpass": "${this.cCurrentPassword.value}",
           "newpass": "${this.cNewPassword.value}" }`,
        (data: ResultWithDescription) => {
          if (data.result) {
            this.cNewPassword.reset();
            this.cRepeatNewPassword.reset();
            this.cCurrentPassword.reset();
            this.successMessage = 'Your password has been successfully changed';
          } else {
            this.errorMessage = data.description;
          }
        }
      );
  }
}
