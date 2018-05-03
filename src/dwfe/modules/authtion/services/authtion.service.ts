import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {AuthtionExchangeService} from './authtion-exchange.service';
import {UtilsDwfeService} from '../../../services/utils.service';

@Injectable()
export class AuthtionService {

  private auth: AuthtionCredentials;
  private authStorageKey = 'authCredentials';
  public user: AuthtionUser;
  private userStorageKey = 'userData';

  private subjLoggedIn = new BehaviorSubject<boolean>(this.init());
  private subjPerformLoginResult = new Subject<ResultOfActionWithDescription>();

  constructor(private exchangeService: AuthtionExchangeService) {
  }

  init(): boolean {
    this.auth = AuthtionCredentials.fromStorage(this.authStorageKey);
    this.user = AuthtionUser.fromStorage(this.userStorageKey);
    if (this.auth
      && this.user
      && this.auth.expiresIn > Date.now()) {
      const time = this.get90PercentFromTimeWhenTokenValid();
      const time1Day = (60 * 60 * 24) * 1000;
      if (time < time1Day) {
        this.scheduleTokenUpdate(10 * 1000);
      } else {
        this.scheduleTokenUpdate(time);
      }
      return true;
    } else {
      this.coverUpOnesTraces();
      return false;
    }
  }

  public get isLoggedIn(): Observable<boolean> {
    return this.subjLoggedIn.asObservable();
  }

  public get performLoginResult(): Observable<ResultOfActionWithDescription> {
    return this.subjPerformLoginResult.asObservable();
  }

  private login(): void {
    this.subjLoggedIn.next(true);
  }

  public logout(): void {
    this.exchangeService.get_signOut(this.auth.accessToken).subscribe(
      data => {
        console.log(data);
        this.coverUpOnesTraces();
        this.subjLoggedIn.next(false);
      },
      error => {
      }
    );
  }

  private coverUpOnesTraces() {
    this.auth = null;
    localStorage.removeItem(this.authStorageKey);
    this.user = null;
    localStorage.removeItem(this.userStorageKey);
  }


  public performLogin(email: string, password: string): void {
    this.exchangeService.post_signIn(email, password).subscribe(
      data => {
        this.exchangeService.get_getConsumerData(data['access_token']).subscribe(
          data2 => {
            console.log(data2);
            this.handleAuthResponse(data);
            this.handleGetUserDataResponse(data2);
            this.login();
            this.subjPerformLoginResult.next(ResultOfActionWithDescription.of(true, ''));
          },
          error2 => {
            this.subjPerformLoginResult.next(ResultOfActionWithDescription.of(false, UtilsDwfeService.getReadableHttpError(error2)));
          });
      },
      error =>
        this.subjPerformLoginResult.next(ResultOfActionWithDescription.of(false, UtilsDwfeService.getReadableHttpError(error)))
    );
  }

  private tokenUpdate() {
    this.exchangeService.post_tokenRefresh(this.auth.refreshToken).subscribe(
      data => {
        this.handleAuthResponse(data);
      },
      error => {
        if (UtilsDwfeService.getHttpError(error) === 'invalid_grant') {
          this.logout();
        } else {
          const time = this.get90PercentFromTimeWhenTokenValid();
          if (time > 1000 * 10) { // if 90% percent time when token valid > 10 seconds
            this.scheduleTokenUpdate(time);
          } else {
            this.logout();
          }
        }
      }
    );
  }

  private handleAuthResponse(data): void {
    // save in RAM
    this.auth = AuthtionCredentials.of(
      data['access_token'],
      data['expires_in'],
      data['refresh_token']);

    // save in local storage
    this.saveInStorage(this.authStorageKey, this.auth);

    // run schedule for token update
    this.scheduleTokenUpdate(this.get90PercentFromTimeWhenTokenValid());
  }

  private handleGetUserDataResponse(data2): void {
    // save in RAM
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
    this.user = AuthtionUser.of(
      data['id'],
      data['email'],
      data['nickName'],
      data['firstName'],
      data['lastName'],
      data['emailConfirmed'],
      hasRoleAdmin,
      hasRoleUser
    );

    // save in local storage
    this.saveInStorage(this.userStorageKey, this.user);
  }

  private saveInStorage(key: string, obj): void {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  private get90PercentFromTimeWhenTokenValid(): number {
    return Math.round((this.auth.expiresIn - Date.now()) * 0.9);
  }

  private scheduleTokenUpdate(time: number): void {
    if (time <= 0) {
      return;
    }
    setTimeout(() => this.tokenUpdate(), time);
  }

}

export class ResultOfActionWithDescription {

  private _result: boolean;
  private _description: string;

  get result(): boolean {
    return this._result;
  }

  get description(): string {
    return this._description;
  }

  public static of(result: boolean, description: string): ResultOfActionWithDescription {
    const obj = new ResultOfActionWithDescription();
    obj._result = result;
    obj._description = description;
    return obj;
  }
}

class AuthtionCredentials {
  private _accessToken: string;
  private _expiresIn: number;
  private _refreshToken: string;

  get accessToken(): string {
    return this._accessToken;
  }

  get expiresIn(): number {
    return this._expiresIn;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  public static of(accessToken: string, expiresIn: number, refreshToken: string): AuthtionCredentials {
    const obj = new AuthtionCredentials();
    obj._accessToken = accessToken;
    obj._expiresIn = Date.now() + expiresIn * 1000;
    obj._refreshToken = refreshToken;
    return obj;
  }

  public static fromStorage(key: string): AuthtionCredentials {
    let obj = null;
    const parsed = JSON.parse(localStorage.getItem(key));
    if (parsed) {
      obj = new AuthtionCredentials();
      obj._accessToken = parsed._accessToken;
      obj._expiresIn = +parsed._expiresIn;
      obj._refreshToken = parsed._refreshToken;
    }
    return obj;
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
    return obj;
  }

  public static fromStorage(key): AuthtionUser {
    let obj = null;
    const parsed = JSON.parse(localStorage.getItem(key));
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
}
