import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {BehaviorSubject} from 'rxjs';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {countries, genders} from '@dwfe/classes/UtilsDwfe';

import {AuthtionAccount, AuthtionService} from '../../services/authtion.service';

@Component({
  selector: 'app-authtion-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class AuthtionPersonalComponent extends AbstractExchangeableDwfe implements OnInit, AfterViewInit {

  private user: AuthtionAccount;
  private subjCancel = new BehaviorSubject<boolean>(false);

  private gEmail = new FormGroup({});
  private cEmail: AbstractControl;
  private tEmail: boolean;
  private emailNonPublic_changed: boolean;

  private gNickName = new FormGroup({});
  private cNickName: AbstractControl;
  private tNickName: boolean;
  private nickName_changed: boolean;
  private nickNameNonPublic_changed: boolean;

  private gFirstName = new FormGroup({});
  private cFirstName: AbstractControl;
  private tFirstName: boolean;
  private firstName_changed: boolean;
  private firstNameNonPublic_changed: boolean;

  private gMiddleName = new FormGroup({});
  private cMiddleName: AbstractControl;
  private tMiddleName: boolean;
  private middleName_changed: boolean;
  private middleNameNonPublic_changed: boolean;

  private gLastName = new FormGroup({});
  private cLastName: AbstractControl;
  private tLastName: boolean;
  private lastName_changed: boolean;
  private lastNameNonPublic_changed: boolean;

  private gender: string;
  private tGender: boolean;
  private genders = genders;
  private gender_changed: boolean;
  private genderNonPublic_changed: boolean;

  private gDateOfBirth = new FormGroup({});
  private cDateOfBirth: AbstractControl;
  private tDateOfBirth: boolean;
  private dateOfBirth_changed: boolean;
  private dateOfBirthNonPublic_changed: boolean;

  private country: string;
  private tCountry: boolean;
  private countries = countries;
  private country_changed: boolean;
  private countryNonPublic_changed: boolean;

  private gCity = new FormGroup({});
  private cCity: AbstractControl;
  private tCity: boolean;
  private city_changed: boolean;
  private cityNonPublic_changed: boolean;

  private gCompany = new FormGroup({});
  private cCompany: AbstractControl;
  private tCompany: boolean;
  private company_changed: boolean;
  private companyNonPublic_changed: boolean;

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

  private hasPageBeenChanged(): boolean {
    return this.emailNonPublic_changed
      || this.nickName_changed || this.nickNameNonPublic_changed
      || this.firstName_changed || this.firstNameNonPublic_changed
      || this.middleName_changed || this.middleNameNonPublic_changed
      || this.lastName_changed || this.lastNameNonPublic_changed
      || this.gender_changed || this.genderNonPublic_changed
      || this.dateOfBirth_changed || this.dateOfBirthNonPublic_changed
      || this.country_changed || this.countryNonPublic_changed
      || this.city_changed || this.cityNonPublic_changed
      || this.company_changed || this.companyNonPublic_changed;
  }

  private performUpdateAccount(): void {
  }

  private performCancelChanges(): void {
    this.subjCancel.next(true);
  }
}
