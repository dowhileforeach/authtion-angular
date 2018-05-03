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

  private subjectOfLoggedIn = new BehaviorSubject<boolean>(this.init());
  private subjectOfPerformLoginResult = new Subject<ResultOfActionWithDescription>();

  constructor(private exchangeService: AuthtionExchangeService) {
  }

  init(): boolean {
    this.auth = AuthtionCredentials.fromStorage(this.authStorageKey);
    if (this.auth && this.auth.expiresIn > Date.now()) {
      const time = this.get90PercentFromTimeWhenTokenValid();
      const time1Day = (60 * 60 * 24) * 1000;
      if (time < time1Day) {
        this.scheduleTokenUpdate(10 * 1000);
      } else {
        this.scheduleTokenUpdate(time);
      }
      return true;
    } else {
      this.clearAuthtionData();
      return false;
    }
  }

  public get isLoggedIn(): Observable<boolean> {
    return this.subjectOfLoggedIn.asObservable();
  }

  public get performLoginResult(): Observable<ResultOfActionWithDescription> {
    return this.subjectOfPerformLoginResult.asObservable();
  }

  private login(): void {
    this.subjectOfLoggedIn.next(true);
  }

  public logout(): void {
    this.clearAuthtionData();
    this.subjectOfLoggedIn.next(false);
  }

  private clearAuthtionData() {
    this.auth = null;
    localStorage.removeItem(this.authStorageKey);
  }

  public performLogin(email: string, password: string): void {
    this.exchangeService.post_signIn(email, password).subscribe(
      data => {
        this.handleAuthtionResponse(data);
        this.login();
        this.subjectOfPerformLoginResult.next(ResultOfActionWithDescription.of(true, ''));
      },
      error =>
        this.subjectOfPerformLoginResult.next(ResultOfActionWithDescription.of(false, UtilsDwfeService.getReadableHttpError(error)))
    );
  }

  private tokenUpdate() {
    this.exchangeService.post_tokenRefresh(this.auth.refreshToken).subscribe(
      data => {
        this.handleAuthtionResponse(data);
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

  private handleAuthtionResponse(data): void {
    // save in RAM
    this.auth = AuthtionCredentials.of(
      data['access_token'],
      data['expires_in'],
      data['refresh_token']);

    // save in local storage
    this.saveAuthtionDataInStorage();

    // run schedule for token update
    this.scheduleTokenUpdate(this.get90PercentFromTimeWhenTokenValid());
  }

  private saveAuthtionDataInStorage(): void {
    localStorage.setItem(this.authStorageKey, JSON.stringify(this.auth));
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

  public static of(id: number,
                   email: string,
                   nickName: string,
                   firstName: string,
                   lastName: string,
                   emailConfirmed: boolean): AuthtionUser {
    const obj = new AuthtionUser();
    obj._id = id;
    obj._email = email;
    obj._nickName = nickName;
    obj._firstName = firstName;
    obj._lastName = lastName;
    obj._emailConfirmed = emailConfirmed;
    return obj;
  }
}
