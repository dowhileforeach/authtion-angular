import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';

import {BehaviorSubject} from 'rxjs';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {countries, genders, UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

import {AuthtionService, AuthtionUserPersonal} from '../../services/authtion.service';
import {AuthtionExchangeService} from '../../services/authtion-exchange.service';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';

@Component({
  selector: 'app-authtion-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class AuthtionPersonalComponent extends AbstractExchangeableDwfe implements OnInit, AfterViewInit {

  private userPersonal: AuthtionUserPersonal;
  private subjCancel = new BehaviorSubject<boolean>(false);

  private cEmail: AbstractControl;
  private tEmail: AbstractControl;
  private emailNonPublic_changed: boolean;

  private cNickName: AbstractControl;
  private tNickName: AbstractControl;
  private nickName_changed: boolean;
  private nickNameNonPublic_changed: boolean;

  private cFirstName: AbstractControl;
  private tFirstName: AbstractControl;
  private firstName_changed: boolean;
  private firstNameNonPublic_changed: boolean;

  private cMiddleName: AbstractControl;
  private tMiddleName: AbstractControl;
  private middleName_changed: boolean;
  private middleNameNonPublic_changed: boolean;

  private cLastName: AbstractControl;
  private tLastName: AbstractControl;
  private lastName_changed: boolean;
  private lastNameNonPublic_changed: boolean;

  private cGender: AbstractControl;
  private tGender: AbstractControl;
  private gendersList = genders;
  private gender_changed: boolean;
  private genderNonPublic_changed: boolean;

  private cDateOfBirth: AbstractControl;
  private tDateOfBirth: AbstractControl;
  private dateOfBirth_changed: boolean;
  private dateOfBirthNonPublic_changed: boolean;

  private cCountry: AbstractControl;
  private tCountry: AbstractControl;
  private countriesList = countries;
  private country_changed: boolean;
  private countryNonPublic_changed: boolean;

  private cCity: AbstractControl;
  private tCity: AbstractControl;
  private city_changed: boolean;
  private cityNonPublic_changed: boolean;

  private cCompany: AbstractControl;
  private tCompany: AbstractControl;
  private company_changed: boolean;
  private companyNonPublic_changed: boolean;

  constructor(private authtionService: AuthtionService,
              private exchangeService: AuthtionExchangeService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    this.userPersonal = this.authtionService.userPersonal;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cEmail.setValue(this.userPersonal.email);
      this.cEmail.disable();
      this.tEmail.setValue(!this.userPersonal.emailNonPublic);

      this.cNickName.setValue(this.userPersonal.nickName);
      this.tNickName.setValue(!this.userPersonal.nickNameNonPublic);

      this.cFirstName.setValue(this.userPersonal.firstName);
      this.tFirstName.setValue(!this.userPersonal.firstNameNonPublic);

      this.cMiddleName.setValue(this.userPersonal.middleName);
      this.tMiddleName.setValue(!this.userPersonal.middleNameNonPublic);

      this.cLastName.setValue(this.userPersonal.lastName);
      this.tLastName.setValue(!this.userPersonal.lastNameNonPublic);

      this.cGender.setValue(this.userPersonal.gender);
      this.tGender.setValue(!this.userPersonal.genderNonPublic);

      this.cDateOfBirth.setValue(this.userPersonal.dateOfBirth);
      this.tDateOfBirth.setValue(!this.userPersonal.dateOfBirthNonPublic);

      this.cCountry.setValue(this.userPersonal.country);
      this.tCountry.setValue(!this.userPersonal.countryNonPublic);

      this.cCity.setValue(this.userPersonal.city);
      this.tCity.setValue(!this.userPersonal.cityNonPublic);

      this.cCompany.setValue(this.userPersonal.company);
      this.tCompany.setValue(!this.userPersonal.companyNonPublic);

      this.resetBackendError('tEmail', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cNickName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('tNickName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cFirstName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('tFirstName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cMiddleName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('tMiddleName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cLastName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('tLastName', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cGender', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('tGender', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cDateOfBirth', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('tDateOfBirth', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cCountry', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('tCountry', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cCity', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('tCity', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('cCompany', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
      this.resetBackendError('tCompany', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    }, 10);
  }

  private get isChanged(): boolean {
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
    // console.log(this.getReqBody());
    this.exchangeService.updateAccountExchanger
      .run(this,
        this.getReqBody(),
        (data: ResultWithDescription) => {
          if (data.result) {
            this.successMessage = 'Personal info has been successfully updated';
          } else {
            this.errorMessage = data.description;
          }
        });
  }

  private performCancelEdit(): void {
    this.subjCancel.next(true);
  }

  private getReqBody(): string {
    const req = {};

    this.addField('emailNonPublic', !this.tEmail.value, req);

    this.addField('nickName', this.cNickName.value, req);
    this.addField('nickNameNonPublic', !this.tNickName.value, req);

    this.addField('firstName', this.cFirstName.value, req);
    this.addField('firstNameNonPublic', !this.tFirstName.value, req);

    this.addField('middleName', this.cMiddleName.value, req);
    this.addField('middleNameNonPublic', !this.tMiddleName.value, req);

    this.addField('lastName', this.cLastName.value, req);
    this.addField('lastNameNonPublic', !this.tLastName.value, req);

    this.addField('gender', this.cGender.value, req);
    this.addField('genderNonPublic', !this.tGender.value, req);

    let dateOfBirth = this.cDateOfBirth.value;
    dateOfBirth = dateOfBirth === null ? null
      : UtilsDwfe.getFormattedDate(dateOfBirth);
    this.addField('dateOfBirth', dateOfBirth, req);
    this.addField('dateOfBirthNonPublic', !this.tDateOfBirth.value, req);

    this.addField('country', this.cCountry.value, req);
    this.addField('countryNonPublic', !this.tCountry.value, req);

    this.addField('city', this.cCity.value, req);
    this.addField('cityNonPublic', !this.tCity.value, req);

    this.addField('company', this.cCompany.value, req);
    this.addField('companyNonPublic', !this.tCompany.value, req);

    return JSON.stringify(req);
  }

  private addField(name, value, req): void {
    if (this[name + '_changed']) {
      req[name] = value;
    }
  }
}
