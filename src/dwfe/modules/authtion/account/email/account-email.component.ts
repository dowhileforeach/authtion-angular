import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {AbstractControl} from '@angular/forms';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';

import {AuthtionService} from '../../services/authtion.service';
import {AuthtionExchangeService} from '../../services/authtion-exchange.service';

@Component({
  selector: 'app-authtion-account-email',
  templateUrl: './account-email.component.html',
  styleUrls: ['./account-email.component.scss'],
})
export class AuthtionAccountEmailComponent extends AbstractExchangeableDwfe implements AfterViewInit {

  private cCurrentEmail: AbstractControl;
  private cNewEmail: AbstractControl;
  @ViewChild('refNewEmail', {read: ElementRef}) private refNewEmail: ElementRef;

  private cCurrentPassword: AbstractControl;
  @ViewChild('refCurrentPassword', {read: ElementRef}) private refCurrentPassword: ElementRef;

  constructor(private authtionService: AuthtionService,
              private exchangeService: AuthtionExchangeService) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cCurrentEmail.setValue(this.authtionService.user.email);
      this.cCurrentEmail.disable();
    }, 10);

    this.resetBackendError('cNewEmail', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    this.resetBackendError('cCurrentPassword', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
  }

  private performChangeEmail(): void {
  }
}
