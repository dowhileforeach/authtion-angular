import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {AuthtionExchangeService} from './authtion-exchange.service';
import {UtilsDwfeService} from '../../../services/utils.service';

@Injectable()
export class AuthtionService {

  private subjectOfLoggedIn = new BehaviorSubject<boolean>(false);
  private subjectOfPerformLoginResult = new Subject<ReasonOfFailure>();

  private authtionData: AuthtionData;
  private authtionDataKey = 'authtionData';

  constructor(private exchangeService: AuthtionExchangeService) {
  }

  public get isLoggedIn(): Observable<boolean> {
    return this.subjectOfLoggedIn.asObservable()
      .share(); // for prevent async pipes create multiple subscriptions
  }

  public get performLoginResult(): Observable<ReasonOfFailure> {
    return this.subjectOfPerformLoginResult.asObservable();
  }

  private login(): void {
    this.subjectOfLoggedIn.next(true);
  }

  private logout(): void {
    if (this.authtionData) {
      this.authtionData = null;
      localStorage.removeItem(this.authtionDataKey);
    }
    this.subjectOfLoggedIn.next(false);
  }

  public performLogin(email: string, password: string): void {
    this.exchangeService.post_signIn(email, password).subscribe(
      data => {
        this.handleAuthtionResponse(data);
        this.login();
        this.subjectOfPerformLoginResult.next(ReasonOfFailure.of(true, ''));
      },
      error =>
        this.subjectOfPerformLoginResult.next(ReasonOfFailure.of(false, UtilsDwfeService.getReadableHttpError(error)))
    );
  }

  private tokenUpdate() {
    this.exchangeService.post_tokenRefresh(this.authtionData.refreshToken).subscribe(
      data => {
        this.handleAuthtionResponse(data);
      },
      error => {
        const time = this.get90PercentTimeWhenTokenValid();
        if (time > 1000 * 10) { // if 90% percent time when token valid > 10 seconds
          this.scheduleTokenUpdate(time);
        } else {
          this.logout();
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

export class ReasonOfFailure {

  private _value: boolean;
  private _reasonOfFailure: string;

  get value(): boolean {
    return this._value;
  }

  get reasonOfFailure(): string {
    return this._reasonOfFailure;
  }

  public static of(value: boolean, reasonOfFailure: string): ReasonOfFailure {
    const obj = new ReasonOfFailure();
    obj._value = value;
    obj._reasonOfFailure = reasonOfFailure;
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
}
