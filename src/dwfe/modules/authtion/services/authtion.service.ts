import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable, Subject} from 'rxjs';

import {AuthtionExchangeService, endpoints, ResultWithDescription} from './authtion-exchange.service';
import {UtilsDwfeService} from '@dwfe/services/utils.service';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthtionAbstractRequest, GetAccount} from '@dwfe/modules/authtion/services/authtion-exchange.service';

const credentials = {
  trusted: { // issued token is valid for a long time, e.g. 20 days
    name: 'Trusted',
    password: 'YWPVYGiGLW4Whnr3Q5vuzd8i'
  },
  untrusted: { // the token is issued for a very short time, e.g. 3 minutes
    name: 'Untrusted',
    password: '4rZi5yEhcv5Jb3jSzGPfFFDK'
  }
};

const credentialsBase64Encoded = {
  trusted: 'Basic ' + btoa(credentials.trusted.name + ':' + credentials.trusted.password),
  untrusted: 'Basic ' + btoa(credentials.untrusted.name + ':' + credentials.untrusted.password)
};

const optionsAuthentificationReq = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', credentialsBase64Encoded.trusted)
};

@Injectable()
export class AuthtionService {

  private auth: AuthtionCredentials;
  public user: AuthtionAccount;

  private subjIsLoggedIn = new BehaviorSubject<boolean>(this.init());
  private subjPerform__signIn = new Subject<ResultWithDescription>();

  constructor(public exchangeService: AuthtionExchangeService) {
  }

  init(): boolean {
    this.auth = AuthtionCredentials.fromStorage(this);
    this.user = AuthtionAccount.fromStorage();

    if (this.auth && this.user) {
      return true;
    } else {
      this.coverUpOnesTraces();
      return false;
    }
  }

  public get isLoggedIn(): Observable<boolean> {
    return this.subjIsLoggedIn.asObservable();
  }

  public get perform__signIn(): Observable<ResultWithDescription> {
    return this.subjPerform__signIn.asObservable();
  }

  private login(): void {
    this.subjIsLoggedIn.next(true);
  }

  public logout(): void {
    this.tokenRefreshHttpReq$(this.auth.accessToken).subscribe(
      data => { // I already did everything I could
      },
      error => { // I already did everything I could
      }
    );
    setTimeout(() => {
      this.coverUpOnesTraces();
      this.subjIsLoggedIn.next(false);
    }, 250);
  }

  private coverUpOnesTraces() {
    this.auth = null;
    this.user = null;
    AuthtionCredentials.removeFromStorage();
    AuthtionAccount.removeFromStorage();
  }

  public signInHttpReq$(email: string, password: string): Observable<Object> {
    return this.exchangeService.http.post(
      endpoints.signIn,
      new HttpParams()
        .set('grant_type', 'password')
        .set('username', email)
        .set('password', password),
      optionsAuthentificationReq);
  }

  public tokenRefreshHttpReq$(refreshToken: string): Observable<Object> {
    return this.exchangeService.http.post(
      endpoints.tokenRefresh,
      new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('refresh_token', refreshToken),
      optionsAuthentificationReq);
  }

  public signOutHttpReq$(accessToken: string): Observable<Object> {
    return this.exchangeService.http.get(
      endpoints.signOut,
      AuthtionAbstractRequest.optionsForAuthorizedReq(accessToken));
  }

  public performSignIn(email: string, password: string): void {
    this.signInHttpReq$(email, password).subscribe(
      response => {
        const getAccount = new GetAccount(this.exchangeService);
        getAccount.performRequest({accessToken: response['access_token']});
        getAccount.result$.subscribe(
          rwd => {
            if (rwd.result) {
              this.auth = AuthtionCredentials.of(this, response);
              this.user = AuthtionAccount.of(rwd.data);
              this.login();
              this.subjPerform__signIn.next(ResultWithDescription.of({result: true}));
            } else {
              this.subjPerform__signIn.next(ResultWithDescription.of({description: rwd.description}));
            }
          });
      },
      error => AuthtionExchangeService.handleError(error, this.subjPerform__signIn)
    );
  }

  public tokenUpdate(authFromThePast: AuthtionCredentials): void {

    // Update the token only in case:
    if (this.auth                          // 1. Is logged in
      && authFromThePast.equals(this.auth) // 2. The time has come to update the CURRENT token
    ) {

      this.tokenRefreshHttpReq$(this.auth.refreshToken).subscribe(
        response => {
          this.auth = AuthtionCredentials.of(this, response);
        },
        error => {
          if (UtilsDwfeService.isInvalidGrantError(error)) {
            this.logout();
          } else {
            const time = this.auth.get90PercentFromTimeWhenTokenValid();
            if (time > 10 * 1000) { // if 90% percent of token valid time > 10 seconds
              this.auth.scheduleTokenUpdate(this, time);
            } else {
              this.logout();
            }
          }
        }
      );

    }
  }
}

class AuthtionCredentials {
  private _instanceID: string;
  private _date: Date;

  private _accessToken: string;
  private _expiresIn: number;
  private _refreshToken: string;

  static get storageKey(): string {
    return 'credentialsData';
  }

  get instanceID(): string {
    return this._instanceID;
  }

  get date(): Date {
    return this._date;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get expiresIn(): number {
    return this._expiresIn;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  public static of(authtionService: AuthtionService, data): AuthtionCredentials {
    const obj = new AuthtionCredentials();
    obj._instanceID = UtilsDwfeService.randomStr(15);
    obj._date = new Date();

    obj._accessToken = data['access_token'];
    obj._expiresIn = Date.now() + data['expires_in'] * 1000;
    obj._refreshToken = data['refresh_token'];

    obj.saveInStorage();
    obj.scheduleTokenUpdate(authtionService, obj.get90PercentFromTimeWhenTokenValid());
    return obj;
  }

  public static fromStorage(authtionService: AuthtionService): AuthtionCredentials {
    let obj = null;

    try {
      const parsed = JSON.parse(localStorage.getItem(AuthtionCredentials.storageKey));
      if (parsed && +parsed._expiresIn > Date.now()) {
        obj = new AuthtionCredentials();
        obj._instanceID = parsed._instanceID;
        obj._date = parsed._date;

        obj._accessToken = parsed._accessToken;
        obj._expiresIn = +parsed._expiresIn;
        obj._refreshToken = parsed._refreshToken;

        const time = obj.get90PercentFromTimeWhenTokenValid();
        const time1Day = (60 * 60 * 24) * 1000;
        if (time < time1Day) {
          obj.scheduleTokenUpdate(authtionService, 10 * 1000);
        } else {
          obj.scheduleTokenUpdate(authtionService, time);
        }
      }
    } catch (e) {
      return null;
    }
    return obj;
  }

  public static removeFromStorage(): void {
    try {
      localStorage.removeItem(AuthtionCredentials.storageKey);
    } catch (e) {
    }
  }

  private saveInStorage(): void {
    try {
      localStorage.setItem(AuthtionCredentials.storageKey, JSON.stringify(this));
    } catch (e) {
    }
  }

  public equals(obj): boolean {
    return this.instanceID === obj.instanceID;
  }

  public get90PercentFromTimeWhenTokenValid(): number {
    return Math.round((this.expiresIn - Date.now()) * 0.9);
  }

  public scheduleTokenUpdate(authtionService: AuthtionService, time: number): void {
    if (time >= 0) {
      setTimeout(() => {
        authtionService.tokenUpdate(this);
      }, time);
    }
  }
}

class AuthtionAccount {
  private _id: number;

  private _createdOn: Date;
  private _updatedOn: Date;
  private _hasRoleAdmin: boolean;
  private _hasRoleUser: boolean;

  private _email: string;
  private _emailConfirmed: boolean;
  private _emailNonPublic: boolean;

  private _nickName: string;
  private _nickNameNonPublic: boolean;

  private _firstName: string;
  private _firstNameNonPublic: boolean;

  private _middleName: string;
  private _middleNameNonPublic: boolean;

  private _lastName: string;
  private _lastNameNonPublic: boolean;

  private _gender: string;
  private _genderNonPublic: boolean;

  private _dateOfBirth: Date;
  private _dateOfBirthNonPublic: boolean;

  private _country: string;
  private _countryNonPublic: boolean;

  static get storageKey(): string {
    return 'accountData';
  }

  get id(): number {
    return this._id;
  }

  get createdOn(): Date {
    return this._createdOn;
  }

  get updatedOn(): Date {
    return this._updatedOn;
  }

  get hasRoleAdmin(): boolean {
    return this._hasRoleAdmin;
  }

  get hasRoleUser(): boolean {
    return this._hasRoleUser;
  }

  get email(): string {
    return this._email;
  }

  get emailConfirmed(): boolean {
    return this._emailConfirmed;
  }

  get emailNonPublic(): boolean {
    return this._emailNonPublic;
  }

  get nickName(): string {
    return this._nickName;
  }

  get nickNameNonPublic(): boolean {
    return this._nickNameNonPublic;
  }

  get firstName(): string {
    return this._firstName;
  }

  get firstNameNonPublic(): boolean {
    return this._firstNameNonPublic;
  }

  get middleName(): string {
    return this._middleName;
  }

  get middleNameNonPublic(): boolean {
    return this._middleNameNonPublic;
  }

  get lastName(): string {
    return this._lastName;
  }

  get lastNameNonPublic(): boolean {
    return this._lastNameNonPublic;
  }

  get gender(): string {
    return this._gender;
  }

  get genderNonPublic(): boolean {
    return this._genderNonPublic;
  }

  get dateOfBirth(): Date {
    return this._dateOfBirth;
  }

  get dateOfBirthNonPublic(): boolean {
    return this._dateOfBirthNonPublic;
  }

  get country(): string {
    return this._country;
  }

  get countryNonPublic(): boolean {
    return this._countryNonPublic;
  }

  public static of(data): AuthtionAccount {
    let hasRoleAdmin = false;
    let hasRoleUser = false;
    data['authorities'].forEach(next => {
      if (next === 'ADMIN') {
        hasRoleAdmin = true;
      } else if (next === 'USER') {
        hasRoleUser = true;
      }
    });

    const obj = new AuthtionAccount();

    obj._id = data['id'];

    obj._createdOn = new Date(data['createdOn']);
    obj._updatedOn = new Date(data['updatedOn']);
    obj._hasRoleAdmin = hasRoleAdmin;
    obj._hasRoleUser = hasRoleUser;

    obj._email = data['email'];
    obj._emailConfirmed = data['emailConfirmed'];
    obj._emailNonPublic = data['emailNonPublic'];

    obj._nickName = data['nickName'];
    obj._nickNameNonPublic = data['nickNameNonPublic'];

    obj._firstName = data['firstName'];
    obj._firstNameNonPublic = data['firstNameNonPublic'];

    obj._middleName = data['middleName'];
    obj._middleNameNonPublic = data['middleNameNonPublic'];

    obj._lastName = data['lastName'];
    obj._lastNameNonPublic = data['lastNameNonPublic'];

    obj._gender = data['gender'];
    obj._genderNonPublic = data['genderNonPublic'];

    obj._dateOfBirth = data['dateOfBirth'];
    obj._dateOfBirthNonPublic = data['dateOfBirthNonPublic'];

    obj._country = data['country'];
    obj._countryNonPublic = data['countryNonPublic'];

    obj.saveInStorage();
    return obj;
  }

  public static fromStorage(): AuthtionAccount {
    let obj = null;

    try {
      const parsed = JSON.parse(localStorage.getItem(AuthtionAccount.storageKey));
      if (parsed) {
        obj = new AuthtionAccount();

        obj._id = +parsed._id;

        obj._createdOn = new Date(parsed._createdOn);
        obj._updatedOn = new Date(parsed._updatedOn);
        obj._hasRoleAdmin = parsed._hasRoleAdmin === 'true';
        obj._hasRoleUser = parsed._hasRoleUser === 'true';

        obj._email = parsed._email;
        obj._emailConfirmed = parsed._emailConfirmed === 'true';
        obj._emailNonPublic = parsed._emailNonPublic === 'true';

        obj._nickName = parsed._nickName;
        obj._nickNameNonPublic = parsed._nickNameNonPublic === 'true';

        obj._firstName = parsed._firstName;
        obj._firstNameNonPublic = parsed._firstNameNonPublic === 'true';

        obj._middleName = parsed._middleName;
        obj._middleNameNonPublic = parsed._middleNameNonPublic === 'true';

        obj._lastName = parsed._lastName;
        obj._lastNameNonPublic = parsed._lastNameNonPublic === 'true';

        obj._gender = parsed._gender;
        obj._genderNonPublic = parsed._genderNonPublic === 'true';

        obj._dateOfBirth = new Date(parsed._dateOfBirth);
        obj._dateOfBirthNonPublic = parsed._dateOfBirthNonPublic === 'true';

        obj._country = parsed._country;
        obj._countryNonPublic = parsed._countryNonPublic === 'true';
      }
    } catch (e) {
      return null;
    }
    return obj;
  }

  public static removeFromStorage(): void {
    try {
      localStorage.removeItem(AuthtionAccount.storageKey);
    } catch (e) {
    }
  }

  private saveInStorage(): void {
    try {
      localStorage.setItem(AuthtionAccount.storageKey, JSON.stringify(this));
    } catch (e) {
    }
  }
}
