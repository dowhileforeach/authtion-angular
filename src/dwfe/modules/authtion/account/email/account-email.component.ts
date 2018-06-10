import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';

import {AuthtionService} from '../../services/authtion.service';
import {AuthtionExchangeService} from '../../services/authtion-exchange.service';

@Component({
  selector: 'app-authtion-account-email',
  templateUrl: './account-email.component.html',
  styleUrls: ['./account-email.component.scss'],
})
export class AuthtionAccountEmailComponent extends AbstractExchangeableDwfe implements OnInit, AfterViewInit {

  private groupCurrentEmail = new FormGroup({});
  private controlCurrentEmail: AbstractControl;

  private groupNewEmail = new FormGroup({});
  private controlNewEmail: AbstractControl;
  @ViewChild('refNewEmail', {read: ElementRef}) private refNewEmail: ElementRef;

  private groupCurrentPassword = new FormGroup({});
  private controlCurrentPassword: AbstractControl;
  @ViewChild('refCurrentPassword', {read: ElementRef}) private refCurrentPassword: ElementRef;

  constructor(private authtionService: AuthtionService,
              private exchangeService: AuthtionExchangeService) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.controlCurrentEmail = this.groupCurrentEmail.get('txt');

    setTimeout(() => {
      this.controlCurrentEmail.setValue(this.authtionService.user.email);
      this.controlCurrentEmail.disable();
    }, 10);

    this.controlNewEmail = this.groupNewEmail.get('email');
    this.controlCurrentPassword = this.groupCurrentPassword.get('password');

    this.resetBackendError('controlNewEmail', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    this.resetBackendError('controlCurrentPassword', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
  }

  private performChangeEmail(): void {
  }
}
