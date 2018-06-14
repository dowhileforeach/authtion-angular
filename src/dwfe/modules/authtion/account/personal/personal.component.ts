import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';

import {BehaviorSubject} from 'rxjs';

import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {countries, genders, UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

import {AuthtionService, AuthtionUserPersonal} from '../../services/authtion.service';
import {AuthtionExchangeService} from '../../services/authtion-exchange.service';

@Component({
  selector: 'app-authtion-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class AuthtionPersonalComponent extends AbstractExchangeableDwfe implements OnInit, AfterViewInit {

  private user: AuthtionUserPersonal;
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
    this.user = this.authtionService.userPersonal;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cEmail.setValue(this.user.email);
      this.cEmail.disable();
      this.tEmail.setValue(!this.user.emailNonPublic);

      this.cNickName.setValue(this.user.nickName);
      this.tNickName.setValue(!this.user.nickNameNonPublic);

      this.cFirstName.setValue(this.user.firstName);
      this.tFirstName.setValue(!this.user.firstNameNonPublic);

      this.cMiddleName.setValue(this.user.middleName);
      this.tMiddleName.setValue(!this.user.middleNameNonPublic);

      this.cLastName.setValue(this.user.lastName);
      this.tLastName.setValue(!this.user.lastNameNonPublic);

      this.cGender.setValue(this.user.gender);
      this.tGender.setValue(!this.user.genderNonPublic);

      this.cDateOfBirth.setValue(this.user.dateOfBirth);
      this.tDateOfBirth.setValue(!this.user.dateOfBirthNonPublic);

      this.cCountry.setValue(this.user.country);
      this.tCountry.setValue(!this.user.countryNonPublic);

      this.cCity.setValue(this.user.city);
      this.tCity.setValue(!this.user.cityNonPublic);

      this.cCompany.setValue(this.user.company);
      this.tCompany.setValue(!this.user.companyNonPublic);
    }, 10);
  }

  private get isChanged(): boolean {
    this.errorMessage = '';
    this.successMessage = '';
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
    console.log(this.getReqBody());
    // this.exchangeService.updateAccountExchanger
    //   .run(this,
    //     this.getReqBody(),
    //     (data: ResultWithDescription) => {
    //       if (data.result) {
    //       } else {
    //       }
    //     });
  }

  private performCancelEdit(): void {
    this.subjCancel.next(true);
  }

  private getReqBody(): string {
    const req = new ReqUpdateAccount();

    req.emailNonPublic = !this.tEmail.value;

    req.nickName = this.cNickName.value;
    req.nickNameNonPublic = !this.tNickName.value;

    req.firstName = this.cFirstName.value;
    req.firstNameNonPublic = !this.tFirstName.value;

    req.middleName = this.cMiddleName.value;
    req.middleNameNonPublic = !this.tMiddleName.value;

    req.lastName = this.cLastName.value;
    req.lastNameNonPublic = !this.tLastName.value;

    req.gender = this.cGender.value;
    req.genderNonPublic = !this.tGender.value;

    const dateOfBirth = this.cDateOfBirth.value;
    req.dateOfBirth = dateOfBirth === null ? null
      : UtilsDwfe.getFormattedDate(dateOfBirth);
    req.dateOfBirthNonPublic = !this.tDateOfBirth.value;

    req.country = this.cCountry.value;
    req.countryNonPublic = !this.tCountry.value;

    req.city = this.cCity.value;
    req.cityNonPublic = !this.tCity.value;

    req.company = this.cCompany.value;
    req.companyNonPublic = !this.tCompany.value;

    return JSON.stringify(req);
  }
}

class ReqUpdateAccount {
  emailNonPublic: boolean;

  nickName: string;
  nickNameNonPublic: boolean;

  firstName: string;
  firstNameNonPublic: boolean;

  middleName: string;
  middleNameNonPublic: boolean;

  lastName: string;
  lastNameNonPublic: boolean;

  gender: string;
  genderNonPublic: boolean;

  dateOfBirth: string;
  dateOfBirthNonPublic: boolean;

  country: string;
  countryNonPublic: boolean;

  city: string;
  cityNonPublic: boolean;

  company: string;
  companyNonPublic: boolean;
}
