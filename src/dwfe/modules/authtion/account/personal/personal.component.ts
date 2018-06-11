import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {countries, genders} from '@dwfe/classes/UtilsDwfe';

import {AuthtionAccount, AuthtionService} from '../../services/authtion.service';
import {Router} from '@angular/router';

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
  private genders = genders;

  private gDateOfBirth = new FormGroup({});
  private cDateOfBirth: AbstractControl;
  private tDateOfBirth: boolean;

  private country: string;
  private tCountry: boolean;
  private countries = countries;

  private gCity = new FormGroup({});
  private cCity: AbstractControl;
  private tCity: boolean;

  private gCompany = new FormGroup({});
  private cCompany: AbstractControl;
  private tCompany: boolean;

  constructor(private authtionService: AuthtionService,
              private router: Router) {
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

      this.cDateOfBirth = this.gDateOfBirth.get('date');
      this.cDateOfBirth.setValue(this.user.dateOfBirth);

      this.cCity = this.gCity.get('txt');
      this.cCity.setValue(this.user.city);

      this.cCompany = this.gCompany.get('txt');
      this.cCompany.setValue(this.user.company);

      this.resetBackendError('cEmail', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cNickName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cFirstName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cMiddleName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cLastName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cDateOfBirth', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cCity', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cCompany', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    }, 10);
  }

  click() {
    console.log('ddd');
    this.router.navigate(['/account/profile']);
    setTimeout(() => this.router.navigate(['/account/profile/personal']), 100);

  }
}
