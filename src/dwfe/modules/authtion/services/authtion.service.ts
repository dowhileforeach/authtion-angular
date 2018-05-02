import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {AuthtionExchangeService} from './authtion-exchange.service';
import {UtilsDwfeService} from '../../../services/utils.service';

@Injectable()
export class AuthtionService {

  private authtionData: AuthtionData;
  private authtionDataKey = 'authtionData';

  private subjectOfLoggedIn = new BehaviorSubject<boolean>(this.init());
  private subjectOfPerformLoginResult = new Subject<ResultOfActionWithDescription>();

  constructor(private exchangeService: AuthtionExchangeService) {
  }

  init(): boolean {
    this.authtionData = AuthtionData.fromStorage(this.authtionDataKey);
    const now = Date.now();

    if (this.authtionData && this.authtionData.expiresIn > now) {
      const delta = this.authtionData.expiresIn - now;
      const time1DayInMilliseconds = (60 * 60 * 24) * 1000;
      if (delta < time1DayInMilliseconds) {
        this.scheduleTokenUpdate(10 * 1000);
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

  private logout(): void {
    this.clearAuthtionData();
    this.subjectOfLoggedIn.next(false);
  }

  private clearAuthtionData() {
    this.authtionData = null;
    localStorage.removeItem(this.authtionDataKey);
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
    this.exchangeService.post_tokenRefresh(this.authtionData.refreshToken).subscribe(
      data => {
        this.handleAuthtionResponse(data);
      },
      error => {
        if (UtilsDwfeService.getHttpError(error) === 'invalid_grant') {
          this.logout();
        } else {
          const time = this.get90PercentTimeWhenTokenValid();
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
    this.authtionData = AuthtionData.of(
      data['access_token'],
      data['expires_in'],
      data['refresh_token']);

    // save in local storage
    this.saveAuthtionDataInStorage();

    // run schedule for token update
    this.scheduleTokenUpdate(this.get90PercentTimeWhenTokenValid());
  }

  private saveAuthtionDataInStorage(): void {
    localStorage.setItem(this.authtionDataKey, JSON.stringify(this.authtionData));
  }

  private get90PercentTimeWhenTokenValid(): number {
    return (this.authtionData.expiresIn - Date.now()) * 0.9;
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

class AuthtionData {
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

  public static of(accessToken: string, expiresIn: number, refreshToken: string): AuthtionData {
    const obj = new AuthtionData();
    obj._accessToken = accessToken;
    obj._expiresIn = Date.now() + expiresIn * 1000;
    obj._refreshToken = refreshToken;
    return obj;
  }

  public static fromStorage(key: string): AuthtionData {
    const parsed = JSON.parse(localStorage.getItem(key));
    let obj = null;

    if (parsed) {
      obj = new AuthtionData();
      obj._accessToken = parsed._accessToken;
      obj._expiresIn = +parsed._expiresIn;
      obj._refreshToken = parsed._refreshToken;
    }
    return obj;
  }
}
