import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';

import {AuthtionExchangeService} from '../../services/authtion-exchange.service';

@Component({
  selector: 'app-authtion-account-password',
  templateUrl: './page-account-password.component.html',
  styleUrls: ['./page-account-password.component.scss'],
})
export class AuthtionAccountPasswordComponent extends AbstractExchangeableDwfe implements OnInit, AfterViewInit {

  private groupNewPassword = new FormGroup({});
  private controlNewPassword: AbstractControl;
  @ViewChild('refNewPassword', {read: ElementRef}) private refNewPassword: ElementRef;

  private groupRepeatNewPassword = new FormGroup({});
  private controlRepeatNewPassword: AbstractControl;
  @ViewChild('refRepeatNewPassword', {read: ElementRef}) private refRepeatNewPassword: ElementRef;

  private groupCurrentPassword = new FormGroup({});
  private controlCurrentPassword: AbstractControl;
  @ViewChild('refCurrentPassword', {read: ElementRef}) private refCurrentPassword: ElementRef;

  constructor(private exchangeService: AuthtionExchangeService) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.controlNewPassword = this.groupNewPassword.get('password');
    this.controlRepeatNewPassword = this.groupRepeatNewPassword.get('password');
    this.controlCurrentPassword = this.groupCurrentPassword.get('password');

    this.resetBackendError('controlNewPassword', ['errorMessage'], this.latchForUnsubscribe);
    this.resetBackendError('controlRepeatNewPassword', ['errorMessage'], this.latchForUnsubscribe);
    this.resetBackendError('controlCurrentPassword', ['errorMessage'], this.latchForUnsubscribe);
  }

  private performChangePassword(): void {
    if (this.controlNewPassword.value !== this.controlRepeatNewPassword.value) {
      this.errorMessage = 'New Password and Repeat do not match';
      return;
    }

    this.exchangeService.changePassExchanger
      .run(this,
        `{ "oldpass": "${this.controlCurrentPassword.value}",
           "newpass": "${this.controlNewPassword.value}" }`,
        (data: ResultWithDescription) => {
          if (data.result) {
            // if success
          } else {
            this.errorMessage = data.description;
          }
        }
      );
  }
}
