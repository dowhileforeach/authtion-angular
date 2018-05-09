import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {AuthtionExchangeService, ResultWithDescription} from './authtion-exchange.service';
import {UtilsDwfeService} from '@dwfe/services/utils.service';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class AuthtionService {

  private auth: AuthtionCredentials;
  public user: AuthtionUser;

  private subjIsLoggedIn = new BehaviorSubject<boolean>(this.init());
  private subjPerform__signIn = new Subject<ResultWithDescription>();

  private subscription_getConsumerData: Subscription;

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
    return this.subjIsLoggedIn.asObservable();
  }

  public get perform__signIn(): Observable<ResultWithDescription> {
    return this.subjPerform__signIn.asObservable();
  }

  private login(): void {
    this.subjIsLoggedIn.next(true);
  }

  public logout(): void {
    this.exchangeService.get_signOut(this.auth.accessToken).subscribe(
      data => { // I already did everything I could
      },
      error => { // I already did everything I could
      }
    );

    setTimeout(() => {
      this.coverUpOnesTraces();
      this.subjIsLoggedIn.next(false);
    }, 1000);
  }

  private coverUpOnesTraces() {
    this.auth = null;
    this.user = null;
    AuthtionCredentials.removeFromStorage();
    AuthtionUser.removeFromStorage();
  }

  public performSignIn(email: string, password: string): void {
    this.exchangeService.post_signIn(email, password).subscribe(
      resp => {
        this.exchangeService.performGetConsumerData(resp['access_token']);
        this.subscription_getConsumerData = this.exchangeService.perform__getConsumerData.subscribe(
          rwd => {
            if (rwd.result) {
              this.auth = AuthtionCredentials.of(this, resp);
              this.user = AuthtionUser.of(rwd.data);
              this.login();
              this.subjPerform__signIn.next(ResultWithDescription.of({result: true}));
            } else {
              this.subjPerform__signIn.next(ResultWithDescription.of({description: rwd.description}));
            }
            this.subscription_getConsumerData.unsubscribe();
          }
        );
      },
      error => AuthtionExchangeService.handlePerformError(error, this.subjPerform__signIn)
    );
  }

  public tokenUpdate(authFromThePast: AuthtionCredentials): void {

    // Update the token only in case:
    if (this.auth                          // 1. Is logged in
      && authFromThePast.equals(this.auth) // 2. The time has come to update the CURRENT token
    ) {

      this.exchangeService.post_tokenRefresh(this.auth.refreshToken).subscribe(
        resp => {
          this.auth = AuthtionCredentials.of(this, resp);
        },
        error => {
          if (UtilsDwfeService.isInvalidGrantHttpError(error)) {
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

  public static of(authtionService: AuthtionService, data): AuthtionCredentials {
    const obj = new AuthtionCredentials();
    obj._instanceID = UtilsDwfeService.randomStr(15);

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

  public static of(data): AuthtionUser {
    let hasRoleAdmin = false;
    let hasRoleUser = false;
    data['authorities'].forEach(next => {
      if (next === 'ADMIN') {
        hasRoleAdmin = true;
      } else if (next === 'USER') {
        hasRoleUser = true;
      }
    });

    const obj = new AuthtionUser();

    obj._id = data['id'];
    obj._email = data['email'];
    obj._nickName = data['nickName'];
    obj._firstName = data['firstName'];
    obj._lastName = data['lastName'];
    obj._emailConfirmed = data['emailConfirmed'];
    obj._hasRoleAdmin = hasRoleAdmin;
    obj._hasRoleUser = hasRoleUser;

    obj.saveInStorage();
    return obj;
  }

  public static fromStorage(): AuthtionUser {
    let obj = null;

    try {
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
    } catch (e) {
      return null;
    }
    return obj;
  }

  public static removeFromStorage(): void {
    try {
      localStorage.removeItem(AuthtionUser.storageKey);
    } catch (e) {
    }
  }

  private saveInStorage(): void {
    try {
      localStorage.setItem(AuthtionUser.storageKey, JSON.stringify(this));
    } catch (e) {
    }
  }
}
