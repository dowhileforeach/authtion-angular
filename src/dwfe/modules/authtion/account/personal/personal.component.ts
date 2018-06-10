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

  private gEmail = new FormGroup({});
  private cEmail: AbstractControl;
  private tEmail: boolean;

  private gNickName = new FormGroup({});
  private cNickName: AbstractControl;
  private tNickName: boolean;

  private gFirstName = new FormGroup({});
  private cFirstName: AbstractControl;
  private tFirstName: boolean;

  private gMiddleName = new FormGroup({});
  private cMiddleName: AbstractControl;
  private tMiddleName: boolean;

  private gLastName = new FormGroup({});
  private cLastName: AbstractControl;
  private tLastName: boolean;

  private gender: string;
  private tGender: boolean;
  private genders = [
    {value: null, viewValue: 'Not selected'},
    {value: 'M', viewValue: 'Male'},
    {value: 'F', viewValue: 'Female'},
  ];

  constructor(private authtionService: AuthtionService) {
    super();
  }

  ngOnInit() {
    this.user = this.authtionService.user;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cEmail = this.gEmail.get('txt');
      this.cEmail.setValue(this.user.email);
      this.cEmail.disable();

      this.cNickName = this.gNickName.get('txt');
      this.cNickName.setValue(this.user.nickName);

      this.cFirstName = this.gFirstName.get('txt');
      this.cFirstName.setValue(this.user.firstName);

      this.cMiddleName = this.gMiddleName.get('txt');
      this.cMiddleName.setValue(this.user.middleName);

      this.cLastName = this.gLastName.get('txt');
      this.cLastName.setValue(this.user.lastName);

      this.resetBackendError('cEmail', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    }, 10);
  }
}
