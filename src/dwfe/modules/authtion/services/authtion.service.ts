import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {AuthtionExchangeService} from './authtion-exchange.service';
import {UtilsDwfeService} from '../../../services/utils.service';

@Injectable()
export class AuthtionService {

  private auth: AuthtionCredentials;
  public user: AuthtionUser;

  private subjLoggedIn = new BehaviorSubject<boolean>(this.init());
  private subjPerformLoginResult = new Subject<ResultWithDescription>();

  constructor(public exchangeService: AuthtionExchangeService) {
  }

  init(): boolean {
    this.auth = AuthtionCredentials.fromStorage(this);
    this.user = AuthtionUser.fromStorage();

    if (this.auth && this.user) {
      return true;
    } else {
      this.coverUpOnesTraces();
      return false;
    }
  }

  public get isLoggedIn(): Observable<boolean> {
    return this.subjLoggedIn.asObservable();
  }

  public get performLoginResult(): Observable<ResultWithDescription> {
    return this.subjPerformLoginResult.asObservable();
  }

  private login(): void {
    this.subjLoggedIn.next(true);
  }

  public logout(): void {
    this.exchangeService.get_signOut(this.auth.accessToken).subscribe(
      data => {
        // TODO handle success
        this.coverUpOnesTraces();
        this.subjLoggedIn.next(false);
      },
      error => {
      }
    );
  }

  private coverUpOnesTraces() {
    this.auth = null;
    this.user = null;
    AuthtionCredentials.removeFromStorage();
    AuthtionUser.removeFromStorage();
  }

  public performLogin(email: string, password: string): void {
    this.exchangeService.post_signIn(email, password).subscribe(
      data => {
        this.exchangeService.get_getConsumerData(data['access_token']).subscribe(
          data2 => {
            // TODO handle success
            this.auth = AuthtionCredentials.of(this, data);
            this.user = AuthtionUser.of(data2);
            this.login();
            this.subjPerformLoginResult.next(ResultWithDescription.of(true, ''));
          },
          error2 => {
            this.subjPerformLoginResult.next(ResultWithDescription.of(false, UtilsDwfeService.getReadableHttpError(error2)));
          });
      },
      error =>
        this.subjPerformLoginResult.next(ResultWithDescription.of(false, UtilsDwfeService.getReadableHttpError(error)))
    );
  }

  public tokenUpdate(authFromThePast: AuthtionCredentials): void {
    if (authFromThePast.equals(this.auth)) {
      this.exchangeService.post_tokenRefresh(this.auth.refreshToken).subscribe(
        data => {
          this.auth = AuthtionCredentials.of(this, data);
        },
        error => {
          if (UtilsDwfeService.isInvalidGrantHttpError(error)) {
            this.logout();
          } else {
            const time = this.auth.get90PercentFromTimeWhenTokenValid();
            if (time > 1000 * 10) { // if 90% percent of token valid time > 10 seconds
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

export class ResultWithDescription {

  private _result: boolean;
  private _description: string;

  get result(): boolean {
    return this._result;
  }

  get description(): string {
    return this._description;
  }

  public static of(result: boolean, description: string): ResultWithDescription {
    const obj = new ResultWithDescription();
    obj._result = result;
    obj._description = description;
    return obj;
  }
}

class AuthtionCredentials {
  private _instanceID: string;

  private _accessToken: string;
  private _expiresIn: number;
  private _refreshToken: string;

  static get storageKey(): string {
    return 'authCredentials';
  }

  get instanceID(): string {
    return this._instanceID;
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

  public static of(authtionService: AuthtionService,
                   accessToken: string,
                   expiresIn: number,
                   refreshToken: string): AuthtionCredentials {
    const obj = new AuthtionCredentials();
    obj._instanceID = UtilsDwfeService.randomStr(15);

    obj._accessToken = accessToken;
    obj._expiresIn = Date.now() + expiresIn * 1000;
    obj._refreshToken = refreshToken;

    obj.saveInStorage();
    obj.scheduleTokenUpdate(authtionService, obj.get90PercentFromTimeWhenTokenValid());
    return obj;
  }

  public static of(authtionService: AuthtionService, data): AuthtionCredentials {
    return AuthtionCredentials.of(
      authtionService,
      data['access_token'],
      data['expires_in'],
      data['refresh_token']);
  }

  public static fromStorage(authtionService: AuthtionService): AuthtionCredentials {
    let obj = null;
    const parsed = JSON.parse(localStorage.getItem(AuthtionCredentials.storageKey));

    if (parsed && +parsed._expiresIn > Date.now()) {
      obj = new AuthtionCredentials();
      obj._instanceID = parsed._instanceID;

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
    return obj;
  }

  public static removeFromStorage(): void {
    localStorage.removeItem(AuthtionCredentials.storageKey);
  }

  public equals(obj): boolean {
    return this.instanceID === obj.instanceID;
  }

  public saveInStorage(): void {
    localStorage.setItem(AuthtionCredentials.storageKey, JSON.stringify(this));
  }

  public get90PercentFromTimeWhenTokenValid(): number {
    return Math.round((this.expiresIn - Date.now()) * 0.9);
  }

  public scheduleTokenUpdate(authtionService: AuthtionService, time: number): void {
    if (time >= 0) {
      setTimeout(() => {
        authtionService.tokenUpdate();
      }, time);
    }
  }
}

class AuthtionUser {
  private _id: number;
  private _email: string;
  private _nickName: string;
  private _firstName: string;
  private _lastName: string;
  private _emailConfirmed: boolean;
  private _hasRoleAdmin: boolean;
  private _hasRoleUser: boolean;

  static get storageKey(): string {
    return 'userData';
  }

  get id(): number {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get nickName(): string {
    return this._nickName;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get emailConfirmed(): boolean {
    return this._emailConfirmed;
  }

  get hasRoleAdmin(): boolean {
    return this._hasRoleAdmin;
  }

  get hasRoleUser(): boolean {
    return this._hasRoleUser;
  }

  public static of(id: number,
                   email: string,
                   nickName: string,
                   firstName: string,
                   lastName: string,
                   emailConfirmed: boolean,
                   hasRoleAdmin: boolean,
                   hasRoleUser: boolean): AuthtionUser {
    const obj = new AuthtionUser();

    obj._id = id;
    obj._email = email;
    obj._nickName = nickName;
    obj._firstName = firstName;
    obj._lastName = lastName;
    obj._emailConfirmed = emailConfirmed;
    obj._hasRoleAdmin = hasRoleAdmin;
    obj._hasRoleUser = hasRoleUser;

    obj.saveInStorage();
    return obj;
  }

  public static of(data2): AuthtionUser {
    const data = data2['details'];
    let hasRoleAdmin = false;
    let hasRoleUser = false;
    data['authorities'].forEach(next => {
      if (next === 'ADMIN') {
        hasRoleAdmin = true;
      } else if (next === 'USER') {
        hasRoleUser = true;
      }
    });
    return AuthtionUser.of(
      data['id'],
      data['email'],
      data['nickName'],
      data['firstName'],
      data['lastName'],
      data['emailConfirmed'],
      hasRoleAdmin,
      hasRoleUser
    );
  }

  public static fromStorage(): AuthtionUser {
    let obj = null;
    const parsed = JSON.parse(localStorage.getItem(AuthtionUser.storageKey));
    if (parsed) {
      obj = new AuthtionUser();
      obj._id = +parsed._id;
      obj._email = parsed._email;
      obj._nickName = parsed._nickName;
      obj._firstName = parsed._firstName;
      obj._lastName = parsed._lastName;
      obj._emailConfirmed = parsed._emailConfirmed === 'true';
      obj._hasRoleAdmin = parsed._hasRoleAdmin === 'true';
      obj._hasRoleUser = parsed._hasRoleUser === 'true';
    }
    return obj;
  }

  public static removeFromStorage(): void {
    localStorage.removeItem(AuthtionUser.storageKey);
  }

  public saveInStorage(): void {
    localStorage.setItem(AuthtionUser.storageKey, JSON.stringify(this));
  }
}
