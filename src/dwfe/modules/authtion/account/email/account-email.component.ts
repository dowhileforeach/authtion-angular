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

  private cCurrentPassword: AbstractControl;

  constructor(private authtionService: AuthtionService,
              private exchangeService: AuthtionExchangeService) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cCurrentEmail.setValue(this.authtionService.userPersonal.email);
      this.cCurrentEmail.disable();
    }, 10);

    this.resetBackendMessage('cNewEmail', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    this.resetBackendMessage('cCurrentPassword', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
  }

  private performChangeEmail(): void {
  }
}
