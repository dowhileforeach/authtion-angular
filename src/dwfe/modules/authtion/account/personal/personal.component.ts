import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';

import {AuthtionAccount, AuthtionService} from '../../services/authtion.service';

@Component({
  selector: 'app-authtion-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class AuthtionPersonalComponent extends AbstractExchangeableDwfe implements OnInit, AfterViewInit {

  private user: AuthtionAccount;

  private groupEmail = new FormGroup({});
  private controlEmail: AbstractControl;
  private isEmailPublic: boolean;

  constructor(private authtionService: AuthtionService) {
    super();
  }

  ngOnInit() {
    this.user = this.authtionService.user;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.controlEmail = this.groupEmail.get('txt');
      this.controlEmail.setValue(this.user.email);
      this.controlEmail.disable();

      this.resetBackendError('controlEmail', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    }, 10);
  }
}
